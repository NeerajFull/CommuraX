import { useState } from "react";

const PhotoMessage = ({ classes, photoUrl }) => {
    const [preview, setPreview] = useState(false);
    const handlePreview = () => {
        setPreview(true);
    }

    return (
        <div className="relative">
            <img src={photoUrl} alt="message-photo" className={`max-w-60 max-h-72 ${classes}`} onClick={handlePreview} />

            {(preview &&
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <button className="absolute top-4 right-4 text-white text-4xl" onClick={() => setPreview(false)}>
                        X
                    </button>
                    <img src={photoUrl} alt="preview-photo" className="max-w-full max-h-full object-contain" />
                </div>
            )}

        </div>

    );
}

export default PhotoMessage;