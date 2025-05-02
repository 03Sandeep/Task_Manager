import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
        console.log(token);
        // Example of calling a protected endpoint
        await axios.get("http://localhost:5000/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        toast.error("Session expired or invalid");
        localStorage.removeItem("token");
        router.push("/");
      }
    };

    fetchProtectedData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
        <p className="mb-6 text-center">Welcome to your dashboard!</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
