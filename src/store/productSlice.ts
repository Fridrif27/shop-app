import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { Product, Comment } from "../types"

const API_URL = "http://localhost:3001/products"

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios.get<Product[]>(API_URL)
  return response.data
})

export const fetchProduct = createAsyncThunk("products/fetchProduct", async (id: number) => {
  const response = await axios.get<Product>(`${API_URL}/${id}`)
  return response.data
})

export const addProduct = createAsyncThunk("products/addProduct", async (product: Omit<Product, "id" | "comments">) => {
  const response = await axios.post<Product>(API_URL, { ...product, comments: [] })
  return response.data
})

export const updateProduct = createAsyncThunk("products/updateProduct", async (product: Product) => {
  const response = await axios.put<Product>(`${API_URL}/${product.id}`, product)
  return response.data
})

export const removeProduct = createAsyncThunk("products/removeProduct", async (id: number) => {
  await axios.delete(`${API_URL}/${id}`)
  return id
})

export const addComment = createAsyncThunk(
  "products/addComment",
  async ({ productId, comment }: { productId: number; comment: Omit<Comment, "id" | "productId"> }) => {
    const response = await axios.post<Comment>(`${API_URL}/${productId}/comments`, comment)
    return { productId, comment: response.data }
  },
)

export const removeComment = createAsyncThunk(
  "products/removeComment",
  async ({ productId, commentId }: { productId: number; commentId: number }) => {
    await axios.delete(`${API_URL}/${productId}/comments/${commentId}`)
    return { productId, commentId }
  },
)

interface ProductState {
  items: Product[]
  currentProduct: Product | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ProductState = {
  items: [],
  currentProduct: null,
  status: "idle",
  error: null,
}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || null
      })
      .addCase(fetchProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentProduct = action.payload
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((product) => product.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload
        }
      })
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((product) => product.id !== action.payload)
        if (state.currentProduct && state.currentProduct.id === action.payload) {
          state.currentProduct = null
        }
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<{ productId: number; comment: Comment }>) => {
        const { productId, comment } = action.payload
        const product = state.items.find((p) => p.id === productId)
        if (product) {
          product.comments.push(comment)
        }
        if (state.currentProduct && state.currentProduct.id === productId) {
          state.currentProduct.comments.push(comment)
        }
      })
      .addCase(removeComment.fulfilled, (state, action: PayloadAction<{ productId: number; commentId: number }>) => {
        const { productId, commentId } = action.payload
        const product = state.items.find((p) => p.id === productId)
        if (product) {
          product.comments = product.comments.filter((c) => c.id !== commentId)
        }
        if (state.currentProduct && state.currentProduct.id === productId) {
          state.currentProduct.comments = state.currentProduct.comments.filter((c) => c.id !== commentId)
        }
      })
  },
})

export default productSlice.reducer

