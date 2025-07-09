"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Product } from "./mock-products"
// Import the glassType type from Product
type GlassType = Product extends { glassType?: infer T } ? T : undefined;

export interface CartItem extends Product {
  quantity: number
  size?: string
  color?: string
  prescriptionFile?: File
  prescriptionFileName?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
}

type CartAction =
  | {
      type: "ADD_ITEM"
      payload: {
        product: Product
        quantity: number
        size?: string
        color?: string
        prescriptionFile?: File
        glassType?: GlassType
      }
    }
  | { type: "REMOVE_ITEM"; payload: { id: number; size?: string; color?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number; size?: string; color?: string } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<{
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  addItem: (
    product: Product,
    quantity: number,
    size?: string,
    color?: string,
    prescriptionFile?: File,
    glassType?: GlassType,
  ) => void
  removeItem: (id: number, size?: string, color?: string) => void
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, size, color, prescriptionFile, glassType } = action.payload
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color && item.glassType === glassType,
      )

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                prescriptionFile: prescriptionFile || item.prescriptionFile,
                prescriptionFileName: prescriptionFile?.name || item.prescriptionFileName,
              }
            : item,
        )
      } else {
        newItems = [
          ...state.items,
          {
            ...product,
            quantity,
            size,
            color,
            prescriptionFile,
            prescriptionFileName: prescriptionFile?.name,
            glassType,
          },
        ]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return { ...state, items: newItems, totalItems, totalPrice }
    }

    case "REMOVE_ITEM": {
      const { id, size, color } = action.payload
      const newItems = state.items.filter((item) => !(item.id === id && item.size === size && item.color === color))
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return { ...state, items: newItems, totalItems, totalPrice }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity, size, color } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id, size, color } })
      }

      const newItems = state.items.map((item) =>
        item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item,
      )
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return { ...state, items: newItems, totalItems, totalPrice }
    }

    case "CLEAR_CART":
      return { ...state, items: [], totalItems: 0, totalPrice: 0 }

    case "OPEN_CART":
      return { ...state, isCartOpen: true }

    case "CLOSE_CART":
      return { ...state, isCartOpen: false }

    case "LOAD_CART": {
      const items = action.payload.map((item) => ({
        ...item,
        // Don't restore prescription files from localStorage for security
        prescriptionFile: undefined,
      }))
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { ...state, items, totalItems, totalPrice }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isCartOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ayouni-cart")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: items })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes (excluding prescription files)
  useEffect(() => {
    const itemsToSave = state.items.map((item) => ({
      ...item,
      prescriptionFile: undefined, // Don't save files to localStorage
    }))
    localStorage.setItem("ayouni-cart", JSON.stringify(itemsToSave))
  }, [state.items])

  const addItem = (
    product: Product,
    quantity: number,
    size?: string,
    color?: string,
    prescriptionFile?: File,
    glassType?: GlassType,
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, size, color, prescriptionFile, glassType } })
  }

  const removeItem = (id: number, size?: string, color?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size, color } })
  }

  const updateQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity, size, color } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        isCartOpen: state.isCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
