import { useState } from 'react'
import { exportUrlShortener } from '../http/export-url-shortener'

export const urlShortenerUseDownload = () => {
	const [isLoadingReport, setIsLoadingReport] = useState(false)

	const handleDownloadShortUrlReport = async () => {
		try {
			setIsLoadingReport(true)

			const { exportUrl } = await exportUrlShortener()

			const a = document.createElement('a')
			a.href = exportUrl
			a.download = 'relatorio-links.csv'

			document.body.appendChild(a)
			a.click()
			a.remove()
		} catch (error) {
			console.error('Erro ao baixar arquivo:', error)
		} finally {
			setIsLoadingReport(false)
		}
	}

	return {
		isLoadingReport,
		handleDownloadShortUrlReport,
	}
}
