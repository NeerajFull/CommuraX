import GoogleMeetIcon from "/google-meet-icon-sm.png"
import { anotherAxiosInstance, axiosInstance } from "../lib/axios";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getAllIntegrations } from "../lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function IntegrationsPage() {
    const userId = useSelector(state => state.user.userId);
    const [btnName, setBtnName] = useState("Connect");

    const { isLoading, data: integrationsData } = useQuery({
        queryKey: ["integrations"],
        queryFn: getAllIntegrations,
        retry: false,
    });

    useEffect(() => {
        if (integrationsData) {
            setBtnName(integrationsData.status);
        }
    }, [integrationsData]);

    const handleGoogleMeetConnect = async (buttonName) => {
        try {
            if (buttonName === "Disconnect") {
                //remove the Integration
                const response = await axiosInstance.delete("/integrations/remove-integration");
                if (response.status === 200) {
                    setBtnName("Connect");
                    console.log("Integration removed successfully");
                    toast.success("Integration removed successfully");
                } else {
                    toast.error("Error removing integration");
                    throw new Error("Error removing integration");
                }
                return;
            }

            window.open(anotherAxiosInstance.getUri() + `/auth/google?userId=${userId}`, "_blank");
            window.addEventListener('message', function (event) {
                const data = event.data;
                if (data?.type === 'GOOGLE_AUTH' && data.userData.status === 'Disconnect') {
                    console.log('Connected with Google!', data);
                    setBtnName("Disconnect");
                    toast.success("Google Meet integration successful! You can now create meetings.");
                }
            });

        } catch (error) {
            console.error("Error connecting to Google Meet:", error);
        }
    }

    if (isLoading) return (
        <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    )
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                <h1 className="text-3xl font-bold">Integrations</h1>
                <p className="mt-4">Connect your favorite apps and services to enhance your experience.</p>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold">Available Integrations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        <div className="card bg-base-200 shadow-md p-4">
                            <div className="flex items-center gap-4">
                                <img src={GoogleMeetIcon} alt="Google Meet" className="w-12 h-10" />
                                <div>
                                    <h3 className="text-lg font-semibold">Google Meet</h3>
                                    <p className="text-sm text-gray-500">Schedule and join meetings easily.</p>
                                </div>
                            </div>
                            <button className="btn btn-primary mt-4" onClick={() => handleGoogleMeetConnect(btnName)}>{btnName}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}