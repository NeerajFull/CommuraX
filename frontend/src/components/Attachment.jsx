
import { useEffect, useRef, useState } from "react";
import { File, Image, Paperclip } from "lucide-react";
import { uploadPhoto } from "../lib/api";
import { setPhotoUrl } from "../store/slices/appSlice";
import { useDispatch } from "react-redux";
import socket from "../lib/socket";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

export default function Attachment({ loggedInUserId, setMessages, setMessage }) {

    const dispatch = useDispatch();
    const { id: selectedUserId } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        const options = {
            maxSizeMB: 0.5,         // Max size in MB
            maxWidthOrHeight: 1024, // Resize large images
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const formData = new FormData();
        formData.append('image', compressedFile);
        formData.append("senderId", loggedInUserId);
        formData.append("receiverId", selectedUserId);
        try {
            const { url } = await uploadPhoto(formData);
            if (!url) {
                toast.error("Failed to upload photo");
                return;
            }
            dispatch(setPhotoUrl(url));
            socket.emit("send-message", {
                senderId: loggedInUserId,
                receiverId: selectedUserId,
                content: url,
                type: "photo"
            });
            setMessages((prev) => [...prev, { fromSelf: true, content: url, timestamp: new Date(), type: "photo" }]);
            setMessage("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload photo");
        }
    }

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown || !dropdown.current || dropdown.current.contains(target) || trigger.current.contains(target)) return;

            setDropdownOpen(false);
        }

        document.addEventListener("click", clickHandler);

        return () => {
            document.removeEventListener("click", clickHandler);
        }
    }, []);

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;

            setDropdownOpen(false);
        }

        document.addEventListener("keydown", keyHandler);

        return () => {
            document.removeEventListener("keydown", keyHandler);
        }
    }, [])

    return (
        <div className="relative flex">
            <button className="text-[#98A6AD] hover:text-body " onClick={(e) => {
                e.preventDefault();
                setDropdownOpen(!dropdownOpen)
            }} ref={trigger}>
                <Paperclip />
            </button>

            <div ref={dropdown} onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)} className={`absolute right-0 -top-24 z-40 w-52 space-y-1 rounded-sm border border-stroke bg-white p-2 shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? "block" : "hidden"}`}>
                <button type="button" className="flex w-full items-center gap-2 rounded-sm px-3 py-1 text-left text-sm hover:bg-gray" >
                    <label htmlFor="mediaUpload" className="flex gap-2 w-full cursor-pointer">
                        <Image className="size-4" />
                        Images & Videos
                    </label>
                    <input type="file" accept="image/*" className="hidden" id="mediaUpload" onChange={handlePhotoUpload} />

                </button>

                <button className="flex w-full items-center gap-2 rounded-sm px-3 py-1 text-left text-sm hover:bg-gray">
                    <File className="size-4" />
                    Files & Documents
                </button>
            </div>
        </div>
    )
}
