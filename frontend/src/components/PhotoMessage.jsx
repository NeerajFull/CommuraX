
const PhotoMessage = ({ classes, photoUrl }) => {
    return (
        <img src={photoUrl} alt="message-photo" className={`max-w-60 max-h-72 ${classes}`} />
    );
}

export default PhotoMessage;