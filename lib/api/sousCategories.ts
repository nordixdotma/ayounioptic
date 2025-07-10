import type { Category } from "./categories"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface SousCategory {
  id: number
  name: string
  image: string
  categoryId: number
  createdAt?: string
  updatedAt?: string
  // Optional relations returned by some endpoints
  category?: Category
  products?: unknown[]
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Request failed with status ${res.status}: ${errorBody}`)
  }
  return res.json() as Promise<T>
}

// GET /sousCategories → list all
export async function fetchSousCategories(): Promise<SousCategory[]> {
  const res = await fetch(`${API_BASE_URL}/sousCategories`, { cache: "no-store" })
  return handleResponse<SousCategory[]>(res)
}

// GET /sousCategories/{id}
export async function fetchSousCategory(id: number): Promise<SousCategory> {
  const res = await fetch(`${API_BASE_URL}/sousCategories/${id}`, { cache: "no-store" })
  return handleResponse<SousCategory>(res)
}

// POST /sousCategories
export async function createSousCategory({
  name,
  categoryId,
  image,
}: {
  name: string
  categoryId: number
  image: File
}): Promise<SousCategory> {
  const formData = new FormData()
  formData.append("name", name)
  formData.append("categoryId", String(categoryId))
  formData.append("image", image)

  const res = await fetch(`${API_BASE_URL}/sousCategories`, {
    method: "POST",
    body: formData,
  })

  return handleResponse<SousCategory>(res)
}

// PUT /sousCategories/{id}
export async function updateSousCategory({
  id,
  name,
  categoryId,
  image,
}: {
  id: number
  name?: string
  categoryId?: number
  image?: File
}): Promise<SousCategory> {
  const formData = new FormData()
  if (name !== undefined) formData.append("name", name)
  if (categoryId !== undefined) formData.append("categoryId", String(categoryId))
  if (image !== undefined) formData.append("image", image)

  const res = await fetch(`${API_BASE_URL}/sousCategories/${id}`, {
    method: "PUT",
    body: formData,
  })

  return handleResponse<SousCategory>(res)
}

// DELETE /sousCategories/{id}
export async function deleteSousCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/sousCategories/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Failed to delete sousCategory (status ${res.status}): ${errorBody}`)
  }
} 