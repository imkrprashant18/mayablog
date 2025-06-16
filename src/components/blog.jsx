import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { formatToMonthDateYear } from "../utils/date"
import Navabr from "./navbar"


const Blog = () => {
  const params = useParams()
  const blogId = params.id
  const [blog, setBlog] = useState(null)

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

  useEffect(() => {
    getBlog(blogId)
  }, [blogId])

  if (!blog) {
    return <div className="p-4">Loading blog...</div>
  }

  return (
    <>
    <Navabr/>
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
      <p className="text-lg text-gray-800 leading-relaxed">{blog.content}</p>
    </div>
    </>
  )
}

export default Blog
