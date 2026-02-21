import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    amount: Number,
    paymentDate: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);