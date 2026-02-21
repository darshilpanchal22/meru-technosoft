import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function InvoiceDetails() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchInvoice = async () => {
        try {
            const res = await api.get(`/invoices/${id}`);
            setData(res.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchInvoice();
    }, [id]);

    const handlePayment = async () => {
        if (!amount || Number(amount) <= 0) return;

        try {
            await api.post(`/invoices/${id}/payments`, {
                amount: Number(amount)
            });
            setAmount("");
            fetchInvoice();
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading...
            </div>
        );

    if (!data)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Invoice not found
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Invoice #{data.invoice.invoiceNumber}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {data.invoice.customerName}
                        </p>
                    </div>

                    <span
                        className={`px-4 py-1 text-sm rounded-full font-medium ${data.invoice.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {data.invoice.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 text-sm text-gray-600">
                    <div>
                        <p>
                            <span className="font-medium text-gray-800">
                                Issue Date:
                            </span>{" "}
                            {new Date(
                                data.invoice.issueDate
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="font-medium text-gray-800">
                                Due Date:
                            </span>{" "}
                            {new Date(
                                data.invoice.dueDate
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-center">Qty</th>
                                <th className="p-3 text-center">Unit Price</th>
                                <th className="p-3 text-center">Line Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.lines.map((l) => (
                                <tr key={l._id} className="border-t">
                                    <td className="p-3">{l.description}</td>
                                    <td className="p-3 text-center">
                                        {l.quantity}
                                    </td>
                                    <td className="p-3 text-center">
                                        ₹{l.unitPrice}
                                    </td>
                                    <td className="p-3 text-center font-medium">
                                        ₹{l.lineTotal}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 text-right space-y-2">
                    <p>Total: ₹{data.total}</p>
                    <p>Paid: ₹{data.amountPaid}</p>
                    <p className="font-bold text-lg">
                        Balance: ₹{data.balanceDue}
                    </p>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Payments</h2>
                    <div className="space-y-2">
                        {data.payments.map((p) => (
                            <div
                                key={p._id}
                                className="flex justify-between bg-gray-50 p-3 rounded-lg"
                            >
                                <span>
                                    {new Date(
                                        p.paymentDate
                                    ).toLocaleDateString()}
                                </span>
                                <span className="font-medium">
                                    ₹{p.amount}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter payment amount"
                        />
                        <button
                            onClick={handlePayment}
                            disabled={data.balanceDue === 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
                        >
                            Add Payment
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}