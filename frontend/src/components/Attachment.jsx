
import { useEffect, useRef, useState } from "react";
import { File, Image, Paperclip } from "lucide-react";

export default function Attachment() {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

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
                <button className="flex w-full items-center gap-2 rounded-sm px-3 py-1 text-left text-sm hover:bg-gray" >
                    <Image className="size-4"/>
                    Images & Videos
                </button>

                <button className="flex w-full items-center gap-2 rounded-sm px-3 py-1 text-left text-sm hover:bg-gray">
                    <File className="size-4" />
                    Files & Documents
                </button>
            </div>
        </div>
    )
}
