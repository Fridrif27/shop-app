import { Routes, Route } from "react-router-dom"
import ProductList from "./pages/ProductList"
import ProductView from "./pages/ProductView"

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductView />} />
    </Routes>
  )
}

export default App

