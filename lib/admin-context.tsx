"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer } from "react"
import type { CartItem } from "./cart-context"
import type { Product } from "./mock-products"

export interface Category {
  id: number
  name: string
  image: string
}

export interface Type {
  id: number
  name: string
  image: string
  categoryId: number
}

export interface AdminProduct extends Omit<Product, "category" | "type"> {
  categoryId: number
  typeId: number
}

export interface Order {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  items: CartItem[]
  totalPrice: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: string
  address?: string
}

interface AdminState {
  categories: Category[]
  types: Type[]
  products: AdminProduct[]
  orders: Order[]
}

type AdminAction =
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: number }
  | { type: "SET_TYPES"; payload: Type[] }
  | { type: "ADD_TYPE"; payload: Type }
  | { type: "UPDATE_TYPE"; payload: Type }
  | { type: "DELETE_TYPE"; payload: number }
  | { type: "SET_PRODUCTS"; payload: AdminProduct[] }
  | { type: "ADD_PRODUCT"; payload: AdminProduct }
  | { type: "UPDATE_PRODUCT"; payload: AdminProduct }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "UPDATE_ORDER_STATUS"; payload: { id: number; status: Order["status"] } }

const AdminContext = createContext<{
  state: AdminState
  dispatch: React.Dispatch<AdminAction>
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: number) => void
  addType: (type: Omit<Type, "id">) => void
  updateType: (type: Type) => void
  deleteType: (id: number) => void
  addProduct: (product: Omit<AdminProduct, "id">) => void
  updateProduct: (product: AdminProduct) => void
  deleteProduct: (id: number) => void
  updateOrderStatus: (id: number, status: Order["status"]) => void
} | null>(null)

const initialState: AdminState = {
  categories: [
    {
      id: 1,
      name: "Homme",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Femme",
      image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=200&h=200&fit=crop",
    },
  ],
  types: [
    {
      id: 1,
      name: "Vue",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop",
      categoryId: 1,
    },
    {
      id: 2,
      name: "Soleil",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop",
      categoryId: 2,
    },
  ],
  products: [
    {
      id: 1,
      name: "Monture Classique Homme",
      price: 1200,
      oldPrice: 1500,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      ],
      categoryId: 1, // Homme
      typeId: 1, // Vue
      inStock: true,
      description:
        "Monture classique pour homme avec design élégant et moderne. Parfaite pour un usage quotidien avec un style professionnel.",
    },
    {
      id: 2,
      name: "Lunettes de Soleil Femme Premium",
      price: 950,
      oldPrice: 1200,
      image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop",
      ],
      categoryId: 2, // Femme
      typeId: 2, // Soleil
      inStock: true,
      description:
        "Lunettes de soleil premium pour femme avec protection UV maximale. Design moderne et élégant pour toutes les occasions.",
    },
  ],
  orders: [
    {
      id: 1,
      customerName: "Ahmed Benali",
      customerEmail: "ahmed@example.com",
      customerPhone: "+212 6 12 34 56 78",
      items: [
        {
          id: 1,
          name: "Monture Classique Homme",
          price: 1200,
          oldPrice: 1500,
          image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
          images: [],
          category: "homme",
          type: "vue",
          inStock: true,
          quantity: 1,
        },
      ],
      totalPrice: 1200,
      status: "pending",
      createdAt: new Date().toISOString(),
      address: "Marrakech, Gueliz",
    },
    {
      id: 2,
      customerName: "Fatima Zahra",
      customerEmail: "fatima@example.com",
      customerPhone: "+212 6 87 65 43 21",
      items: [
        {
          id: 2,
          name: "Lunettes de Soleil Femme Premium",
          price: 950,
          oldPrice: 1200,
          image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop",
          images: [],
          category: "femme",
          type: "soleil",
          inStock: true,
          quantity: 1,
        },
      ],
      totalPrice: 950,
      status: "completed",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      address: "Casablanca, Maarif",
    },
  ],
}

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] }
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) => (cat.id === action.payload.id ? action.payload : cat)),
      }
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        // Also remove products that belong to this category
        products: state.products.filter((product) => product.categoryId !== action.payload),
      }
    case "SET_TYPES":
      return { ...state, types: action.payload }
    case "ADD_TYPE":
      return { ...state, types: [...state.types, action.payload] }
    case "UPDATE_TYPE":
      return {
        ...state,
        types: state.types.map((type) => (type.id === action.payload.id ? action.payload : type)),
      }
    case "DELETE_TYPE":
      return {
        ...state,
        types: state.types.filter((type) => type.id !== action.payload),
        // Also remove products that belong to this type
        products: state.products.filter((product) => product.typeId !== action.payload),
      }
    case "SET_PRODUCTS":
      return { ...state, products: action.payload }
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] }
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) => (product.id === action.payload.id ? action.payload : product)),
      }
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      }
    case "SET_ORDERS":
      return { ...state, orders: action.payload }
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order,
        ),
      }
    default:
      return state
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem("admin_categories")
    const savedTypes = localStorage.getItem("admin_types")
    const savedProducts = localStorage.getItem("admin_products")
    const savedOrders = localStorage.getItem("admin_orders")

    if (savedCategories) {
      dispatch({ type: "SET_CATEGORIES", payload: JSON.parse(savedCategories) })
    }
    if (savedTypes) {
      dispatch({ type: "SET_TYPES", payload: JSON.parse(savedTypes) })
    }
    if (savedProducts) {
      dispatch({ type: "SET_PRODUCTS", payload: JSON.parse(savedProducts) })
    }
    if (savedOrders) {
      dispatch({ type: "SET_ORDERS", payload: JSON.parse(savedOrders) })
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("admin_categories", JSON.stringify(state.categories))
  }, [state.categories])

  useEffect(() => {
    localStorage.setItem("admin_types", JSON.stringify(state.types))
  }, [state.types])

  useEffect(() => {
    localStorage.setItem("admin_products", JSON.stringify(state.products))
  }, [state.products])

  useEffect(() => {
    localStorage.setItem("admin_orders", JSON.stringify(state.orders))
  }, [state.orders])

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: Date.now() }
    dispatch({ type: "ADD_CATEGORY", payload: newCategory })
  }

  const updateCategory = (category: Category) => {
    dispatch({ type: "UPDATE_CATEGORY", payload: category })
  }

  const deleteCategory = (id: number) => {
    dispatch({ type: "DELETE_CATEGORY", payload: id })
  }

  const addType = (type: Omit<Type, "id">) => {
    const newType = { ...type, id: Date.now() }
    dispatch({ type: "ADD_TYPE", payload: newType })
  }

  const updateType = (type: Type) => {
    dispatch({ type: "UPDATE_TYPE", payload: type })
  }

  const deleteType = (id: number) => {
    dispatch({ type: "DELETE_TYPE", payload: id })
  }

  const addProduct = (product: Omit<AdminProduct, "id">) => {
    const newProduct = { ...product, id: Date.now() }
    dispatch({ type: "ADD_PRODUCT", payload: newProduct })
  }

  const updateProduct = (product: AdminProduct) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: product })
  }

  const deleteProduct = (id: number) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id })
  }

  const updateOrderStatus = (id: number, status: Order["status"]) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } })
  }

  return (
    <AdminContext.Provider
      value={{
        state,
        dispatch,
        addCategory,
        updateCategory,
        deleteCategory,
        addType,
        updateType,
        deleteType,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
