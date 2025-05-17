
import { useSelector } from "react-redux";

export default function Waveform({ incoming }) {
    const audioUrl = useSelector((state) => state.app.recording);


    return (
        <div
            className={` ${incoming ? "bg-gray-950" : "bg-transparent"
                }`}
        >
            <audio controls >
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
