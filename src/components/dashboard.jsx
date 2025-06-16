import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/user-auth";
import axios from "axios";
import BlogCard from "./blog-card";
import Navabr from "./navbar";

const Dashboard = () => {
  const { user, fetchCurrentUser, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublished: false,
    featureImage: null,
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!user) {
      fetchCurrentUser();
    }
  }, [user, fetchCurrentUser]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout API error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, featureImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title || !formData.content || !formData.featureImage) {
      setFormError("All fields are required");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("content", formData.content);
    payload.append("isPublished", formData.isPublished);
    payload.append("featureImage", formData.featureImage);
    try {
      const res = await axios.post("/api/v1/blogs/create-blog", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          title: "",
          content: "",
          isPublished: false,
          featureImage: null,
        });
      }
    } catch (err) {
      setFormError("Failed to create blog");
      throw new Error(err);
    }

  };
  if (loading) return <div>Loading user info...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (

    <>
    <Navabr/>
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

        <button
          onClick={() => setShowModal(true)}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Blog
        </button>
      </div>

      <BlogCard />

      {showModal && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Create Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
                <label className="text-sm">Publish now</label>
              </div>

              <div>
                <label className="block text-sm font-medium">Feature Image</label>
                <input
                  type="file"
                  accept="image/*"
                  name="featureImage"
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
