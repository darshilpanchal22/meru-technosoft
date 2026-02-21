import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: String,
    customerName: String,
    issueDate: Date,
    dueDate: Date,
    status: { type: String, enum: ["DRAFT", "PAID"], default: "DRAFT" },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false }
});

export default mongoose.model("Invoice", invoiceSchema);