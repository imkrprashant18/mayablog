import axios from "axios"
import { useEffect, useState } from "react"
import { formatToMonthDateYear } from "../utils/date"
import { Link } from "react-router-dom"


const BlogCard = () => {
  const [blogs, setBlogs] = useState([])

  const getAllBlogs = async () => {
    try {
      const res = await axios.get("/api/v1/blogs/get-all-blogs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.data.success) {
        setBlogs(res.data.blogs)
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
    }
  }

  useEffect(() => {
    getAllBlogs()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
                <Link to={`/blog/${blog._id}`} >
            <div
              key={index}
              className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
            >
              <img
                src={blog.featureImage}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold line-clamp-2">{blog.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">{blog.content}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {blog.author.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{blog.author.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatToMonthDateYear(blog.createdAt)}
                  </span>
                </div>

                {blog.isPublished && (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded mt-2">
                    Published
                  </span>
                )}
              </div>
              
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogCard
