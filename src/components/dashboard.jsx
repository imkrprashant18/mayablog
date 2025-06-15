import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/user-auth";
import axios from "axios";

const Dashboard = () => {
  const { user, fetchCurrentUser, loading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      fetchCurrentUser();
    }
  }, [user, fetchCurrentUser]);

  const handleLogout = async () => {
    try {
      // Call logout API
      await axios.post(
        "/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/login")
      localStorage.removeItem("token");
    } catch (err) {
      console.error("Logout API error:", err);
    }
  };

  if (loading) return <div>Loading user info...</div>;

  if (error) return <div className="text-red-600">Error: {error}</div>;

  if (!user) return <div>No user data found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="flex items-center space-x-4 mb-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-gray-600">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
