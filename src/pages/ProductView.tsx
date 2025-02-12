import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Product, Comment } from "../types"
import EditProductModal from "../components/EditProductModal"
import AddCommentModal from "../components/AddCommentModal"
import axios from "axios"

const API_URL = "http://localhost:3001/products"

const ProductView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddCommentModal, setShowAddCommentModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<Product>(`${API_URL}/${id}`)
      setProduct(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch product. Please try again later.")
      console.error("Error fetching product:", err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await axios.put<Product>(`${API_URL}/${updatedProduct.id}`, updatedProduct)
      setProduct(response.data)
      setShowEditModal(false)
    } catch (err) {
      console.error("Error updating product:", err)
      alert("Failed to update product. Please try again.")
    }
  }

  const handleAddComment = async (comment: Omit<Comment, "id" | "productId">) => {
    if (!product) return

    try {
      const newComment: Comment = {
        id: Date.now(),
        productId: product.id,
        ...comment,
      }

      const updatedProduct = {
        ...product,
        comments: [...product.comments, newComment],
      }

      const response = await axios.put<Product>(`${API_URL}/${product.id}`, updatedProduct)
      setProduct(response.data)
      setShowAddCommentModal(false)
    } catch (err) {
      console.error("Error adding comment:", err)
      alert("Failed to add comment. Please try again.")
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!product) return

    try {
      const updatedProduct = {
        ...product,
        comments: product.comments.filter((c) => c.id !== commentId),
      }

      const response = await axios.put<Product>(`${API_URL}/${product.id}`, updatedProduct)
      setProduct(response.data)
    } catch (err) {
      console.error("Error deleting comment:", err)
      alert("Failed to delete comment. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading product...</div>
  }

  if (error || !product) {
    return <div className="text-center mt-8 text-red-600">{error || "Product not found"}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => navigate("/")} className="mb-6 text-violet-600 hover:text-violet-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to List
      </button>

      <div className="bg-white rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-w-4 aspect-h-3">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
            <div className="space-y-3 text-lg mb-8">
              <p>Count: {product.count}</p>
              <p>
                Size: {product.size.width}x{product.size.height}
              </p>
              <p>Weight: {product.weight}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-violet-600 text-white px-6 py-2 rounded hover:bg-violet-700"
              >
                Edit Product
              </button>
              <button
                onClick={() => setShowAddCommentModal(true)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <div className="space-y-4">
            {product.comments.map((comment) => (
              <div key={comment.id} className="border rounded p-4">
                <p className="mb-3">{comment.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{comment.date}</span>
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProductModal product={product} onEdit={handleEditProduct} onClose={() => setShowEditModal(false)} />
      )}

      {showAddCommentModal && (
        <AddCommentModal onAdd={handleAddComment} onClose={() => setShowAddCommentModal(false)} />
      )}
    </div>
  )
}

export default ProductView

