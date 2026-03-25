import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Dashboard() {
  const [data, setData] = useState({
    customerName: "",
    phone: "",
    tobaccoType: "",
    rate: "",
    quantity: "",
    quality: "",
    gst: 18,
  });

  const [customers, setCustomers] = useState([]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ✅ Add Customer
  const addCustomer = () => {
    if (!data.customerName || !data.rate || !data.quantity) {
      return alert("Fill required fields");
    }

    const newCustomer = {
      ...data,
      id: Date.now(),
      total: Math.round(total),
    };

    setCustomers([...customers, newCustomer]);

    // reset form
    setData({
      customerName: "",
      phone: "",
      tobaccoType: "",
      rate: "",
      quantity: "",
      quality: "",
      gst: 18,
    });
  };

  // ✅ Calculations
  const rate = Number(data.rate) || 0;
  const quantity = Number(data.quantity) || 0;

  const subtotal = rate * quantity;
  const gstAmount = (subtotal * data.gst) / 100;
  const total = subtotal + gstAmount;

  // ✅ Excel Export (All Customers)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(customers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "customers.xlsx");
  };

  // ✅ PDF
  const downloadPDF = () => {
    const input = document.getElementById("invoice");

    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 190, 0);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <>
      {/* ✅ NAVBAR */}
      <div style={styles.navbar}>
        <h2>Tobacco System</h2>
        <button style={styles.logout}>Logout</button>
      </div>

      <div style={styles.container}>
        {/* ✅ LEFT FORM */}
        <div style={styles.card}>
          <h3>Add Customer</h3>

          <input name="customerName" placeholder="Customer Name" value={data.customerName} onChange={handleChange} style={styles.input} />
          <input name="phone" placeholder="Phone" value={data.phone} onChange={handleChange} style={styles.input} />
          <input name="tobaccoType" placeholder="Tobacco Type" value={data.tobaccoType} onChange={handleChange} style={styles.input} />
          <input name="quality" placeholder="Quality" value={data.quality} onChange={handleChange} style={styles.input} />

          <input type="number" name="rate" placeholder="Rate" value={data.rate} onChange={handleChange} style={styles.input} />
          <input type="number" name="quantity" placeholder="Quantity" value={data.quantity} onChange={handleChange} style={styles.input} />

          <input type="number" name="gst" value={data.gst} onChange={handleChange} style={styles.input} />

          <p>Subtotal: ₹{subtotal}</p>
          <p>Total: ₹{Math.round(total)}</p>

          <button style={styles.button} onClick={addCustomer}>
            Add Customer
          </button>

          <button style={styles.button} onClick={exportToExcel}>
            Export Excel
          </button>
        </div>

        {/* ✅ RIGHT SIDE */}
        <div style={styles.tableCard}>
          <h3>Customer List</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Tobacco</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.customerName}</td>
                  <td>{c.tobaccoType}</td>
                  <td>{c.quantity}</td>
                  <td>₹{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invoice Preview */}
          <div id="invoice" style={styles.invoice}>
            <h3>Invoice Preview</h3>
            <p>Name: {data.customerName}</p>
            <p>Total: ₹{Math.round(total)}</p>
          </div>

          <button style={styles.button} onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#ff007f",
    color: "#fff",
  },
  logout: {
    background: "#fff",
    color: "#ff007f",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  container: {
    display: "flex",
    gap: "20px",
    padding: "20px",
  },
  card: {
    width: "350px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  tableCard: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#ff007f",
    color: "#fff",
    border: "none",
  },
  table: {
    width: "100%",
    marginTop: "10px",
    borderCollapse: "collapse",
  },
  invoice: {
    marginTop: "20px",
    padding: "10px",
    border: "1px dashed #ccc",
  },
};