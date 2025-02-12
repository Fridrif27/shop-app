import type React from "react"
import { Link } from "react-router-dom"
import type { Product } from "../types"

interface ProductCardProps {
  product: Product
  onDelete: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-[360px]">
      <div className="h-[216px] bg-gray-100 relative">
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
          <p className="text-gray-600">Count: {product.count}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Link to={`/product/${product.id}`} className="text-violet-600 hover:text-violet-800">
            View Details
          </Link>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

