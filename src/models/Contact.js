import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
        min: 2
    },
    message: {
        type: String,
        required: true,
        min: 2
    }
}, {timestamps: true})

export default mongoose?.models?.Contact || mongoose.model("Contact", ContactSchema)