import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import InvoiceLine from "../models/InvoiceLine.js";
import Payment from "../models/Payment.js";

export const getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Invoice ID" });
        }

        const invoice = await Invoice.findById(id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const lines = await InvoiceLine.find({ invoiceId: id });
        const payments = await Payment.find({ invoiceId: id });

        const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
        const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const balanceDue = total - amountPaid;

        res.json({ invoice, lines, payments, total, amountPaid, balanceDue });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Invalid ID" });

        if (!amount || amount <= 0)
            return res.status(400).json({ message: "Invalid amount" });

        const invoice = await Invoice.findById(id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const lines = await InvoiceLine.find({ invoiceId: id });
        const payments = await Payment.find({ invoiceId: id });

        const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
        const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const balanceDue = total - amountPaid;

        if (amount > balanceDue)
            return res.status(400).json({ message: "Overpayment not allowed" });

        await Payment.create({ invoiceId: id, amount });

        invoice.total = total;
        invoice.amountPaid = amountPaid + amount;
        invoice.balanceDue = total - invoice.amountPaid;

        if (invoice.balanceDue === 0) invoice.status = "PAID";

        await invoice.save();

        res.json({ message: "Payment added successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const archiveInvoice = async (req, res) => {
    await Invoice.findByIdAndUpdate(req.body.id, { isArchived: true });
    res.json({ message: "Archived" });
};

export const restoreInvoice = async (req, res) => {
    await Invoice.findByIdAndUpdate(req.body.id, { isArchived: false });
    res.json({ message: "Restored" });
};