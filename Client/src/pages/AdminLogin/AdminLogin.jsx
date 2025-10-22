import { useState } from "react";
import { Login } from "../../lib/APIs/authAPI.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router";
const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      setLoading(true);
      const response = await Login(formData);
      console.log(response);
      setAuthUser(response.user);
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 500);
    } catch (error) {
      setErrorMessage(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full my-10">
      <h1 className="text-3xl text-tertiary font-bold">Admin Login</h1>
      <form
        onSubmit={handleSubmit}
        className="border p-8 rounded-md mt-12 w-full max-w-xl"
      >
        <div className="">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border focus:outline-none rounded-md px-6 py-2.5 mt-1"
            onChange={handleChange}
          />
        </div>
        <div className="mt-6">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border focus:outline-none rounded-md px-6 py-2.5 mt-1"
            onChange={handleChange}
          />
        </div>

        {errorMessage && (
          <div className="mt-4 w-full bg-red-100 text-red-600 py-2 text-sm rounded-md px-6">
            {errorMessage}
          </div>
        )}
        <button
          className="w-full text-white bg-tertiary hover:bg-secondary transition-all duration-150 py-2.5 rounded-md mt-6 font-semibold cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
