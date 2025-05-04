import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import Head from "next/head";
import AuthForm from "./auth/AuthForm";
import AssistantModal from "../pages/assistant/ai";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const { data } = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }${endpoint}`,
        formData
      );
      localStorage.setItem("token", data.token);
      toast.success(isLogin ? "Login successful!" : "Registration successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? "Login | TaskFlow" : "Sign Up | TaskFlow"}</title>
        <meta name="description" content="Team Task Management System" />
      </Head>

      {/* Assistant Floating Button */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 z-40"
        aria-label="Open Task Assistant"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Assistant Modal */}
      <AssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md">
          <div className="bg-indigo-600 p-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
            </div>
            <p className="mt-2 text-indigo-100">Team Task Management System</p>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              {isLogin ? "Welcome back!" : "Get started"}
            </h2>
            <AuthForm
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
