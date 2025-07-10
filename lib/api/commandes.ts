import type { Product } from "./products"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface OrderProductRef {
  id: number
  quantity: number
}

export interface Commande {
  id: number
  clientName: string
  clientPhone: string
  image: string | null
  products: OrderProductRef[]
  status: string
  createdAt?: string
  updatedAt?: string
  // When backend populates relation we may get product objects instead of simple refs
  productsDetails?: Product[]
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Request failed with status ${res.status}: ${errorBody}`)
  }
  return res.json() as Promise<T>
}

/* ----------------------------- Fetch commandes ----------------------------- */
export async function fetchCommandes(): Promise<Commande[]> {
  const res = await fetch(`${API_BASE_URL}/commandes`, { cache: "no-store" })
  return handleResponse<Commande[]>(res)
}

export async function fetchCommande(id: number): Promise<Commande> {
  const res = await fetch(`${API_BASE_URL}/commandes/${id}`, { cache: "no-store" })
  return handleResponse<Commande>(res)
}

/* ------------------------------ Create order ------------------------------- */
export async function createCommande({
  clientName,
  clientPhone,
  image,
  products,
  status,
}: {
  clientName: string
  clientPhone: string
  image?: File | null
  products: OrderProductRef[]
  status?: string
}): Promise<Commande> {
  const formData = new FormData()
  formData.append("client_name", clientName)
  formData.append("client_phone", clientPhone)
  if (image) formData.append("image", image)
  formData.append("products", JSON.stringify(products))
  if (status !== undefined) formData.append("status", status)

  const res = await fetch(`${API_BASE_URL}/commandes`, {
    method: "POST",
    body: formData,
  })

  return handleResponse<Commande>(res)
}

/* ------------------------------ Update order ------------------------------ */
export async function updateCommande({
  id,
  clientName,
  clientPhone,
  image,
  products,
  status,
}: {
  id: number
  clientName?: string
  clientPhone?: string
  image?: File | null
  products?: OrderProductRef[]
  status?: string
}): Promise<Commande> {
  const formData = new FormData()
  if (clientName !== undefined) formData.append("client_name", clientName)
  if (clientPhone !== undefined) formData.append("client_phone", clientPhone)
  if (image !== undefined && image !== null) formData.append("image", image)
  if (products !== undefined) formData.append("products", JSON.stringify(products))
  if (status !== undefined) formData.append("status", status)

  const res = await fetch(`${API_BASE_URL}/commandes/${id}`, {
    method: "PUT",
    body: formData,
  })

  return handleResponse<Commande>(res)
}

/* ----------------------------- Delete commande ---------------------------- */
export async function deleteCommande(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/commandes/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Failed to delete commande (status ${res.status}): ${errorBody}`)
  }
} 