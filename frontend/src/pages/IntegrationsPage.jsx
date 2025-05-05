import GoogleMeetIcon from "../../public/google-meet-icon-sm.png"

export default function IntegrationsPage() {

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
                            <button className="btn btn-primary mt-4">Connect</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}