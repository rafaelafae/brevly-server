import api from '../store/api'

interface ExportUrlShortenerResponse {
	exportUrl: string
}

export const exportUrlShortener = async () => {
	const response = await api.post<ExportUrlShortenerResponse>(
		'/links/export',
		{}
	)

	return response.data
}
