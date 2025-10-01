import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import { useCallback } from 'react'
import { Text } from '../components/ui/text'
import { urlShortenerUseList } from '../hooks/url-shortener-use-list'
import { deleteUrlShortener } from '../http/detele-url-shorener'
import type { UrlShortener } from '../interfaces/url-shortener'
import { Button } from './ui/button'
import { Url } from './ui/url'

interface Props {
	shortUrl: UrlShortener
}

export const UrlShortenerCard = ({ shortUrl }: Props) => {
	const { refetch } = urlShortenerUseList()

	const copyShortUrlToClipboard = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(shortUrl.shortenedUrl)
		} catch (err) {
			console.error(err)
		}
	}, [shortUrl.shortenedUrl])

	const handleDeleteShortUrl = useCallback(async () => {
		try {
			await deleteUrlShortener({ urlShortenerId: shortUrl.id })
			await refetch()
		} catch (err) {
			console.error(err)
		}
	}, [refetch, shortUrl.id])

	return (
		<div className="w-full flex flex-row py-4 border-t border-gray-200 overflow-hidden">
			<div className="w-full flex flex-col gap-1 overflow-hidden">
				<Url
					className="line-clamp-1 whitespace-normal"
					href={shortUrl.shortenedUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{shortUrl.shortenedUrl}
				</Url>

				<Text className="line-clamp-1" size="sm">
					{shortUrl.originalUrl}
				</Text>
			</div>

			<div className="flex flex-row items-center gap-5">
				<Text size="sm" className="whitespace-nowrap">
					{shortUrl.accessCount}{' '}
					{shortUrl.accessCount === 1 ? ' acesso' : ' acessos'}
				</Text>

				<div className="flex flex-row items-center gap-1">
					<Button
						aria-label="Copiar link encurtado"
						variant="secondary"
						size="icon"
						onClick={copyShortUrlToClipboard}
						icon={<CopyIcon size={16} className="text-gray-600" />}
					/>

					<Button
						aria-label="Deletar link encurtado"
						variant="secondary"
						size="icon"
						onClick={handleDeleteShortUrl}
						icon={<TrashIcon size={16} className="text-gray-600" />}
					/>
				</div>
			</div>
		</div>
	)
}
