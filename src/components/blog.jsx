import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { formatToMonthDateYear } from "../utils/date"
import Navabr from "./navbar"
import useAuthStore from "../store/user-auth"
import { toast } from "react-toastify"

const Blog = () => {
  const params = useParams()
  const blogId = params.id
  const navigate = useNavigate()
const [loading, setLoading]= useState(false)
  const [blog, setBlog] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    featureImage: "",
  })

  const { fetchCurrentUser, user } = useAuthStore()

  const getBlog = async (id) => {
    try {
      const res = await axios.get(`/api/v1/blogs/get-blog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.data.success) {
        setBlog(res.data.blog)
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error)
    }
  }

  const handleEdit = () => {
    setEditData({
      title: blog.title || "",
      content: blog.content || "",
      featureImage: blog.featureImage || "",
    })
    setShowEditForm(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!editData.title.trim() || !editData.content.trim()) {
      return toast.error("Title and content are required")
    }

    try {

      const formData = new FormData()
      formData.append("title", editData.title)
      formData.append("content", editData.content)

      if (editData.featureImage instanceof File) {
        formData.append("featureImage", editData.featureImage)
      }
setLoading(true)
      const res = await axios.patch(`/api/v1/blogs/update-blog/${blogId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.data.success) {
      
        toast.success("Blog updated successfully")
        setShowEditForm(false)
        getBlog(blogId)
      } else {
        setLoading(false)
        throw new Error(res.data.message)
      }
    } catch (error) {
      setLoading(false)
      console.error("Update failed:", error)
      toast.error("Failed to update blog")
    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/v1/blogs/delete-blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.data.success) {
        toast.success("Blog deleted successfully")
        setTimeout(() => navigate("/dashboard"), 2000)
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error("Failed to delete blog:", error)
      toast.error("Failed to delete blog")
    }
  }

  useEffect(() => {
    getBlog(blogId)
    fetchCurrentUser()
  }, [blogId, fetchCurrentUser])

  if (!blog) return <div className="p-4">Loading blog...</div>

  const isAuthor = user && blog?.author?._id === user._id

  return (
    <>
      <Navabr />
      <div className="max-w-4xl mx-auto p-4">
        <img
          src={blog.featureImage}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          By {blog.author.name} • {formatToMonthDateYear(blog.createdAt)}
         
        </div>
        <h1 className="text-sm text-gray-500 mb-4">Edited at: {formatToMonthDateYear(blog.updatedAt)}</h1>
        <p className="text-lg text-gray-800 leading-relaxed mb-4">{blog.content}</p>

        {isAuthor && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this blog?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  rows={5}
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Feature Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      featureImage: e.target.files[0],
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
                {(editData.featureImage instanceof File || typeof editData.featureImage === "string") && (
                  <img
                    src={
                      editData.featureImage instanceof File
                        ? URL.createObjectURL(editData.featureImage)
                        : editData.featureImage
                    }
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Blog
