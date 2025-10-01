export const FRONTEND_URL = (import.meta.env.VITE_FRONTEND_URL as string) || '-'

export const env = {
	FRONTEND_URL,
	BACKEND_URL: import.meta.env.VITE_BACKEND_URL as string,
}
