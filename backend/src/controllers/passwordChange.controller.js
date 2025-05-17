import nodeMailer from "nodemailer";
import User from "../models/User.js";

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    }
});

function generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }


        const otp = generateOTP();
        const isEmailExist = await User.findOneAndUpdate({ email }, { otp });
        console.log(isEmailExist)
        if (!isEmailExist) {
            throw new Error("Email not found");
        }
        var mailOptions = {
            from: process.env.EMAIL,
            to: email.trim(),
            subject: 'CommuraX Email Verification',
            text: `Your OTP is ${otp}, please use it to verify your email address.`
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error("Error sending OTP, please try again later");
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: "OTP sent successfully", status: 200 });
            }
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: error.message });
    }

}

export const changePassword = async (req, res) => {

    try {
        const { email, password, otp } = req.body;
        if (!email || !password || !otp) {
            return res.status(400).json({ message: "Email, password and OTP are required" });
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.password = password;
        user.otp = null; // Clear the OTP after successful verification
        await user.save();
        return res.status(200).json({ message: "Password changed successfully", status: 200 });

    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ message: error.message });
    }
}