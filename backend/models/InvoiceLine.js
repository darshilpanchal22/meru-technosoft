import mongoose from "mongoose";

const invoiceLineSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    description: String,
    quantity: Number,
    unitPrice: Number,
    lineTotal: Number
});

invoiceLineSchema.pre("save", function (next) {
    this.lineTotal = this.quantity * this.unitPrice;
    next();
});

export default mongoose.model("InvoiceLine", invoiceLineSchema);