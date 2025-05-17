
import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { sendOtp, changePassword } from "../lib/api.js";

const ChangePassword = () => {
    const [passwordChange, setPasswordChange] = useState({
        email: "",
        password: "",
        otp: ""
    });
    const navigate = useNavigate();

    const [isOtpButtonClicked, setIsOtpButtonClicked] = useState(false);

    const verifyEmailAddress = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
            return;
        }
    }
    const handleSubmitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwordChange.email === "" || passwordChange.password === "" || passwordChange.otp === "") {
            toast.error("Please fill all the fields");
            return;
        }
        verifyEmailAddress(passwordChange.email);
        const changePasswordData = {
            email: passwordChange.email,
            password: passwordChange.password,
            otp: passwordChange.otp
        }
        const changePasswordResponse = await changePassword(changePasswordData);
        if (changePasswordResponse.status === 200) {
            toast.success(changePasswordResponse.message);
            navigate("/login");
        } else {
            toast.error(changePasswordResponse.message);
        }
    }
    const handleVerifyEmail = async () => {
        try {
            // Call the API to send OTP
            if (passwordChange.email === "") {
                toast.error("Please enter your email");
                return;
            }
            verifyEmailAddress(passwordChange.email);
            const isOtpSent = await sendOtp({ email: passwordChange.email })
            if (isOtpSent.status === 200) {
                setIsOtpButtonClicked(true);
                toast.success(isOtpSent.message);
            } else {
                throw new Error("Error sending OTP");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }


    }

    return (
        <div
            className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-theme="forest"
        >
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* LOGIN FORM SECTION */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                            CommuraX
                        </span>
                    </div>

                    {/* ERROR MESSAGE DISPLAY */}

                    <div className="w-full">
                        <form onSubmit={handleSubmitPasswordChange}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                        Change your password to continue your language journey
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="input input-bordered w-full"
                                            value={passwordChange.email}
                                            onChange={(e) => setPasswordChange({ ...passwordChange, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {
                                        isOtpButtonClicked ? <>
                                            <div className="form-control w-full space-y-2">
                                                <label className="label">
                                                    <span className="label-text">OTP</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    className="input input-bordered w-full"
                                                    value={passwordChange.otp}
                                                    onChange={(e) => setPasswordChange({ ...passwordChange, otp: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="form-control w-full space-y-2">
                                                <label className="label">
                                                    <span className="label-text">New Password</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="*********"
                                                    className="input input-bordered w-full"
                                                    value={passwordChange.password}
                                                    onChange={(e) => setPasswordChange({ ...passwordChange, password: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <button type="submit" className="btn btn-primary w-full" disabled={""}>
                                                Change Password
                                            </button>
                                        </> : <button type="button" className="btn btn-primary w-full" onClick={handleVerifyEmail}>Verify Email</button>
                                    }


                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-primary hover:underline">
                                                Create one
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                            <p className="opacity-70">
                                Practice conversations, make friends, and improve your language skills together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChangePassword;
