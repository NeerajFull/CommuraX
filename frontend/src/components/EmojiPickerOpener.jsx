import EmojiPicker from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export default function EmojiPickerOpner({ setEmoji }) {
    const theme = useSelector((state) => state.theme.theme);

    const [pickerOpen, setPickerOpen] = useState(false);
    const pickerRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setPickerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEmojiClick = (event) => {
        setEmoji((prev) => prev + event.emoji);
    }


    const handleTrigger = (e) => {
        e.preventDefault();

        setPickerOpen(!pickerOpen);
    }
    return (
        <div className='relative flex hover:text-primary'>

            <Smile ref={buttonRef} className="text-[#98A6AD] hover:text-body cursor-pointer" onClick={handleTrigger} />


            {pickerOpen && <div ref={pickerRef} className='absolute z-40 bottom-6 right-4'> <EmojiPicker onEmojiClick={handleEmojiClick} theme={theme} /> </div>}
        </div>
    )

}