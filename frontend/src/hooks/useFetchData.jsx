import { useEffect, useState } from "react";

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(url, { headers, signal: controller.signal });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(result.message || `Request failed (${res.status})`);
        setData(result.data ?? []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally { if (!controller.signal.aborted) setLoading(false); }
    };
    fetchData();
    return () => controller.abort();
  }, [url]);
  return { data, loading, error };
};
export default useFetchData;
