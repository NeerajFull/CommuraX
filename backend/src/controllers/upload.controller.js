import Message from "../models/Message.js";
import cloudinary from "cloudinary";
import { Readable } from "stream";

export const uploadAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No audio file uploaded" });
        }

        const { senderId, receiverId } = req.body;

        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "chat-audio",
                    format: "webm",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            bufferStream.pipe(stream);
        });


        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content: result.secure_url,
            type: "audio",
            timestamp: new Date(),
        });

        await newMessage.save();

        return res.status(200).json({ url: result.secure_url });
    } catch (error) {
        console.error("Error uploading and saving audio:", error);
        return res.status(500).json({ message: "Audio upload failed" });
    }
}



export const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No photo file uploaded" });
        }

        const { senderId, receiverId } = req.body;

        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: "chat-images"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            bufferStream.pipe(stream);
        });

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content: result.secure_url,
            type: "photo",
            timestamp: new Date(),
        });
        const saved = await newMessage.save();

        if (!saved) {
            return res.status(500).json({ message: "Failed to save message" });
        }
        const deletedDuplicateEntry = await Message.deleteOne({ content: result.secure_url, type: "photo" });
        if (!deletedDuplicateEntry) {
            console.log("Failed to delete duplicate entry");
        }
        return res.status(200).json({ url: result.secure_url });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Upload failed' });
    }

}