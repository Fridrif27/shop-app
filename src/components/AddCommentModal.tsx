import type React from "react"
import { useState } from "react"
import type { Comment } from "../types"

interface AddCommentModalProps {
  onAdd: (comment: Omit<Comment, "id" | "productId">) => void
  onClose: () => void
}

const AddCommentModal: React.FC<AddCommentModalProps> = ({ onAdd, onClose }) => {
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.trim()) {
      onAdd({
        description,
        date: new Date().toLocaleString(),
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Comment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 h-32"
              placeholder="Write your comment here..."
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCommentModal

