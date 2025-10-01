import api from '../store/api'

export interface DeleteUrlShortener {
	urlShortenerId: string
}

export const deleteUrlShortener = async ({
	urlShortenerId,
}: DeleteUrlShortener) => {
	const result = await api.delete('/links', {
		data: { id: urlShortenerId },
	})

	return result.data
}
