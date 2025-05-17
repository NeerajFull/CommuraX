
export default function Waveform({ audioUrl }) {
    return (
        <div
            className="bg-transparent"
        >
            <audio controls >
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
