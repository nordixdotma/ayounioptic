import type { SousCategory } from "./sousCategories"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface Product {
  id: number
  name: string
  price: number
  description: string
  images: string[]
  sousCategoryId: number
  createdAt?: string
  updatedAt?: string
  // Optional relation when backend populates
  sousCategory?: SousCategory
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Request failed with status ${res.status}: ${errorBody}`)
  }
  return res.json() as Promise<T>
}

/**
 * Fetch all products. You can optionally pass a params object to filter or search.
 * The params object will be converted to query string.
 */
export async function fetchProducts(params?: Record<string, string | number | undefined>): Promise<Product[]> {
  let url = `${API_BASE_URL}/products`
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) search.append(key, String(value))
    }
    url += `?${search.toString()}`
  }

  const res = await fetch(url, { cache: "no-store" })
  return handleResponse<Product[]>(res)
}

/** Fetch single product by ID */
export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: "no-store" })
  return handleResponse<Product>(res)
}

/** Create a product (POST /products) */
export async function createProduct({
  name,
  price,
  description,
  sousCategoryId,
  images,
}: {
  name: string
  price: number
  description: string
  sousCategoryId: number
  images: File[]
}): Promise<Product> {
  const formData = new FormData()
  formData.append("name", name)
  formData.append("price", String(price))
  formData.append("description", description)
  formData.append("sousCategoryId", String(sousCategoryId))
  images.forEach((file) => formData.append("images", file))

  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    body: formData,
  })

  return handleResponse<Product>(res)
}

/** Update a product (PUT /products/{id}) */
export async function updateProduct({
  id,
  name,
  price,
  description,
  sousCategoryId,
  images,
}: {
  id: number
  name?: string
  price?: number
  description?: string
  sousCategoryId?: number
  images?: File[]
}): Promise<Product> {
  const formData = new FormData()
  if (name !== undefined) formData.append("name", name)
  if (price !== undefined) formData.append("price", String(price))
  if (description !== undefined) formData.append("description", description)
  if (sousCategoryId !== undefined) formData.append("sousCategoryId", String(sousCategoryId))
  if (images !== undefined) images.forEach((file) => formData.append("images", file))

  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    body: formData,
  })

  return handleResponse<Product>(res)
}

/** Delete product */
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Failed to delete product (status ${res.status}): ${errorBody}`)
  }
} 