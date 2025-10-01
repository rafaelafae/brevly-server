import axios from 'axios'
import { env } from './env'

const api = axios.create({
	baseURL: env.BACKEND_URL,
})

export default api
