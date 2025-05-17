import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setRecording, setVoiceModal } from "../store/slices/appSlice";
import socket from "../lib/socket";
import { useParams } from "react-router";
import { uploadAudio } from "../lib/api";

export default function VoiceRecorder({ loggedInUserId, setMessages, setMessage }) {
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const { id: selectedUserId } = useParams();
    const theme = useSelector((state) => state.theme.theme);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [isRecording, setIsRecording] = useState("none");

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaStream(stream);

            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            recorder.ondataavailable = (event) => {
                setAudioChunks((prevChunks) => [...prevChunks, event.data]);
            };

            recorder.start();
            setIsRecording("start");
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaStream.getTracks().forEach((track) => track.stop());
            setIsRecording("stop");
        }
    };

    const sendRecording = async () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });

        // Prepare form data
        const formData = new FormData();
        formData.append("file", blob, `voice_${Date.now()}.webm`);
        formData.append("senderId", loggedInUserId);
        formData.append("receiverId", selectedUserId);

        const { url } = await uploadAudio(formData);

        dispatch(setRecording(url));
        socket.emit("send-message", {
            senderId: loggedInUserId,
            receiverId: selectedUserId,
            content: url,
            type: "audio"
        });
        dispatch(setVoiceModal(false));
        setMessages((prev) => [...prev, { fromSelf: true, content: url, timestamp: new Date(), type: "audio" }]);
        setMessage("");
        closeModal();
    }

    const closeModal = () => {
        dispatch(setVoiceModal(false));
        setIsRecording("none");
        setAudioChunks([]);
        setMediaRecorder(null);
        setMediaStream(null);
        const targetContainer = document.getElementById("audio-container");
        if (!targetContainer) {
            return;
        }
        const audio = document.getElementsByTagName("audio")[0];
        targetContainer.removeChild(audio);
    }


    const voiceModal = useSelector((state) => state.app.voiceModal);

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!voiceModal || keyCode !== 27) return;
            closeModal();
        }

        document.addEventListener("keydown", keyHandler);

        return () => document.removeEventListener("keydown", keyHandler);
    }, []);


    const addAudioElement = () => {
        const url = URL.createObjectURL(new Blob(audioChunks, { type: "audio/webm" }));
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = false;
        audio.autoplay = true;
        const targetContainer = document.getElementById("audio-container");
        targetContainer.appendChild(audio);
    }

    return (
        <div className={`fixed top-0 left-0 z-999999 flex h-full w-screen items-center justify-center min-h-screen bg-black/90 ${voiceModal ? "block" : "hidden"} px-4 py-5`} data-theme={theme}>
            <div ref={modalRef} className="md:px-17.5 w-80 max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-5">
                <div id="audio-container" className="flex flex-col space-y-8 items-center">
                    <h4 className="font-bold text-black text-xl">Voice Record</h4>
                    <div className="w-1/2">
                        {
                            isRecording === "start" && <img src="https://cdn.pixabay.com/animation/2023/10/10/13/26/13-26-45-476_512.gif" alt="start recording" />
                        }
                        {
                            isRecording === "stop" && <img src="https://cdn.pixabay.com/animation/2023/10/10/13/27/13-27-02-540__340.png" alt="stop recording" />
                        }
                        {
                            isRecording === "none" && null
                        }
                    </div>

                    <div className="flex space-x-5">
                        {isRecording === "none" && <button onClick={startRecording} className="bg-blue-500 hover:bg-opacity-90 transition-all duration-200 rounded-lg px-4 py-2 text-white">Start</button>}
                        {isRecording === "start" && <button onClick={stopRecording} className="bg-red-500 hover:bg-opacity-90 transition-all duration-200 rounded-lg px-4 py-2 text-white">Stop</button>}
                        {isRecording === "stop" && <button onClick={addAudioElement} className="bg-green-500 hover:bg-opacity-90 transition-all duration-200 rounded-lg px-4 py-2 text-white">Play</button>}
                        {isRecording === "stop" && <button onClick={sendRecording} className="bg-violet-500 hover:bg-opacity-90 transition-all duration-200 rounded-lg px-4 py-2 text-white">Send</button>}
                        <button onClick={closeModal} className="bg-black hover:bg-opacity-90 transition-all duration-200 rounded-lg px-4 py-2 text-white">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )

}