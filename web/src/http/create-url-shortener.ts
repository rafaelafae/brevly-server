import api from '../store/api'

export interface CreateUrlShortener {
	name: string
	originalUrl: string
}

export const createtUrlShortener = async (data: CreateUrlShortener) => {
	const playload: { url: string; urlCode?: string } = {
		url: data.originalUrl,
	}

	if (data.name && data.name.trim() !== '') {
		playload.urlCode = data.name
	}

	const result = await api.post('/links', playload)

	return result.data
}
