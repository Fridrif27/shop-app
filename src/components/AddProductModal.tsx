import type React from "react"
import { useState } from "react"
import type { Product } from "../types"

interface AddProductModalProps {
  onAdd: (product: Omit<Product, "id" | "comments">) => void
  onClose: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    count: 0,
    size: {
      width: 0,
      height: 0,
    },
    weight: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required"
    }
    if (formData.count <= 0) {
      newErrors.count = "Count must be greater than 0"
    }
    if (formData.size.width <= 0) {
      newErrors.width = "Width must be greater than 0"
    }
    if (formData.size.height <= 0) {
      newErrors.height = "Height must be greater than 0"
    }
    if (!formData.weight.trim()) {
      newErrors.weight = "Weight is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onAdd(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "width" || name === "height") {
      setFormData((prev) => ({
        ...prev,
        size: {
          ...prev.size,
          [name]: Number(value),
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "count" ? Number(value) : value,
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Image URL"
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Count</label>
            <input
              type="number"
              name="count"
              value={formData.count}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
            {errors.count && <p className="text-red-500 text-sm mt-1">{errors.count}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                name="width"
                value={formData.size.width}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
              />
              {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                name="height"
                value={formData.size.height}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 200g"
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal

