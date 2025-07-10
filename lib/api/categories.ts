// lib/api/categories.ts

// Utility functions for interacting with the Categories endpoints of the backend REST API.
// The base URL can be configured via NEXT_PUBLIC_API_URL to easily switch between environments.
// If not provided, we default to the local development server.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface Category {
  id: number
  name: string
  image: string
  createdAt?: string
  updatedAt?: string
  sousCategories?: unknown[]
}

// Generic helper to handle the response and throw on errors
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Request failed with status ${res.status}: ${errorBody}`)
  }
  return res.json() as Promise<T>
}

/**
 * Retrieve the full list of categories (GET /categories)
 */
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    // Disable Next.js fetch caching so that we always hit the API
    cache: "no-store",
  })
  return handleResponse<Category[]>(res)
}

/**
 * Retrieve a single category by its ID (GET /categories/{id})
 */
export async function fetchCategory(id: number): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    cache: "no-store",
  })
  return handleResponse<Category>(res)
}

/**
 * Create a new category (POST /categories)
 * The backend expects multipart/form-data with fields:
 *  - name: string
 *  - image: File (binary)
 */
export async function createCategory({
  name,
  image,
}: {
  name: string
  image: File
}): Promise<Category> {
  const formData = new FormData()
  formData.append("name", name)
  formData.append("image", image)

  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    body: formData,
  })

  return handleResponse<Category>(res)
}

/**
 * Update an existing category (PUT /categories/{id})
 */
export async function updateCategory({
  id,
  name,
  image,
}: {
  id: number
  name?: string
  image?: File
}): Promise<Category> {
  const formData = new FormData()
  if (name !== undefined) formData.append("name", name)
  if (image !== undefined) formData.append("image", image)

  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    body: formData,
  })

  return handleResponse<Category>(res)
}

/**
 * Delete a category by ID (DELETE /categories/{id})
 */
export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Failed to delete category (status ${res.status}): ${errorBody}`)
  }
} 