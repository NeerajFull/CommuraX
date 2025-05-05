
import mongoose from "mongoose";

const integrationSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true,
            enum: ["Connect", "Disconnect"],
            default: "Connect",
        },
        appName: {
            type: String,
            required: true,
        },
        accessToken: {
            type: [Object]
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Integration = mongoose.model("Integration", integrationSchema);

export default Integration;
