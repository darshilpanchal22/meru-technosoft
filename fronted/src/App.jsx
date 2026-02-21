import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvoiceDetails from "./pages/InvoiceDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
      </Routes>
    </BrowserRouter>
  );
}