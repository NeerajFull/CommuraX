
export default function Waveform({ incoming, audioUrl }) {
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
