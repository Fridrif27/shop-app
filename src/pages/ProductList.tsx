import { useState, useEffect } from "react"
import type { Product } from "../types"
import AddProductModal from "../components/AddProductModal"
import ConfirmModal from "../components/ConfirmModal"
import ProductCard from "../components/ProductCard"
import axios from "axios"

const API_URL = "http://localhost:3001/products"

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "count">("name")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<Product[]>(API_URL)
      setProducts(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch products. Please try again later.")
      console.error("Error fetching products:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (product: Omit<Product, "id" | "comments">) => {
    try {
      const response = await axios.post<Product>(API_URL, { ...product, comments: [] })
      setProducts([...products, response.data])
      setShowAddModal(false)
    } catch (err) {
      console.error("Error adding product:", err)
      alert("Failed to add product. Please try again.")
    }
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`${API_URL}/${productToDelete.id}`)
        setProducts(products.filter((p) => p.id !== productToDelete.id))
        setShowDeleteModal(false)
        setProductToDelete(null)
      } catch (err) {
        console.error("Error deleting product:", err)
        alert("Failed to delete product. Please try again.")
      }
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    }
    return b.count - a.count
  })

  if (isLoading) {
    return <div className="text-center mt-8">Loading products...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            Add Product
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "count")}
            className="border rounded px-3 py-2 min-w-[150px]"
          >
            <option value="name">Sort by Name</option>
            <option value="count">Sort by Count</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} onDelete={() => handleDeleteClick(product)} />
        ))}
      </div>

      {showAddModal && <AddProductModal onAdd={handleAddProduct} onClose={() => setShowAddModal(false)} />}

      {showDeleteModal && (
        <ConfirmModal
          message={`Are you sure you want to delete ${productToDelete?.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default ProductList

