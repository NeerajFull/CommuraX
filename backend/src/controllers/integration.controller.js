import Integration from "../models/Integration.js";

export const getIntegrationsByUserId = async (req, res) => {
    const { id: userId } = req.user;
    try {
        const integration = await Integration.findOne({ userId });

        if (!integration) {
            return res.status(404).json({ message: "No integrations found" });
        }

        res.status(200).json(integration);
    } catch (error) {
        console.error("Error fetching integrations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const removeIntegration = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const integration = await Integration.findOneAndDelete({ userId });

        if (!integration) {
            return res.status(404).json({ message: "No integrations found" });
        }
        // redirect to the getIntegrationsByUserId route
        res.status(200).json({ message: "Integration removed successfully" });
    } catch (error) {
        console.error("Error removing integration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};