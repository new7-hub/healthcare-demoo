import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import { authContext } from "../context/AuthContext";

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const { token } = useContext(authContext);
  const [status, setStatus] = useState("Verifying payment...");
  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId || !token) { setStatus("Payment page loaded."); return; }
    fetch(`${BASE_URL}/bookings/verify/${encodeURIComponent(sessionId)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => { const data = await r.json(); if (!r.ok) throw new Error(data.message); return data; })
      .then(data => { setStatus(data.message); toast.success(data.message); })
      .catch(err => { setStatus(err.message); toast.error(err.message); });
  }, [params, token]);
  return <div className="bg-gray-100 min-h-screen py-20"><div className="bg-white p-8 max-w-xl mx-auto text-center rounded-lg"><h3 className="text-2xl text-gray-900 font-semibold">Payment status</h3><p className="text-gray-600 my-4">{status}</p><Link to="/home" className="inline-block px-12 bg-primaryColor text-white font-semibold py-3 rounded">Go back to Home</Link></div></div>;
};
export default CheckoutSuccess;
