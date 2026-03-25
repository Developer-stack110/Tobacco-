import { useEffect, useState } from "react";
import axios from "axios";
import "./customer.css";

export default function Customers() {
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/api/customers");
    setData(res.data);
  };

  useEffect(() => { load(); }, []);

  const addCustomer = async () => {
    await axios.post("http://localhost:5000/api/customers", form);
    load();
  };

  return (
    <div className="container">
      <h2>Add Customer</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})}/>
      <input placeholder="Phone" onChange={e => setForm({...form, phone:e.target.value})}/>
      <input placeholder="Address" onChange={e => setForm({...form, address:e.target.value})}/>
      <input placeholder="Pincode" onChange={e => setForm({...form, pincode:e.target.value})}/>
      <input placeholder="Tobacco type Name" onChange={e => setForm({...form, tobaccoName:e.target.value})}/>
      

      <select onChange={e => setForm({...form, type:e.target.value})}>
        <option>Type</option>
        <option>Khari</option>
        <option>Jarda</option>
      </select>

      <button onClick={addCustomer}>Save</button>

      <h2>Customer List</h2>

      {data.map(c => (
        <div className="card" key={c._id}>
          <h3>{c.name}</h3>
          <p>{c.phone}</p>
          <p>{c.address}</p>
          <p>{c.pincode}</p>
          <p>{c.tobaccoName} ({c.type})</p>
        </div>
      ))}
    </div>
  );
}