export const AUTH_CONFIG = {
  // Simple authentication credentials - replace with secure authentication
  credentials: {
    username: "admin",
    password: "ayouni2024",
  },
  tokenKey: "admin_token",
  userKey: "admin_user",
}

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_CONFIG.tokenKey) === "authenticated"
}

export const getAuthenticatedUser = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_CONFIG.userKey)
}

export const login = (username: string, password: string): boolean => {
  if (username === AUTH_CONFIG.credentials.username && password === AUTH_CONFIG.credentials.password) {
    localStorage.setItem(AUTH_CONFIG.tokenKey, "authenticated")
    localStorage.setItem(AUTH_CONFIG.userKey, username)
    return true
  }
  return false
}

export const logout = (): void => {
  localStorage.removeItem(AUTH_CONFIG.tokenKey)
  localStorage.removeItem(AUTH_CONFIG.userKey)
}
