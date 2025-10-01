import { LinkIcon } from '@phosphor-icons/react'
import type { UrlShortener } from '../interfaces/url-shortener'
import { Output } from './ui/output'
import { UrlShortenerCard } from './url-shortener-card'

interface Props {
	list: Array<UrlShortener>
	triggerRef: (node?: Element | null) => void
	isFetchingNextPage: boolean
}

export const UrlShortenerList = ({
	list,
	triggerRef,
	isFetchingNextPage,
}: Props) => {
	if (list == null || list.length === 0) {
		return (
			<div className="w-full mt-4 pt-8 pb-4 border-t border-gray-200 text-">
				<Output
					image={<LinkIcon size={32} className="h-16 text-gray-500" />}
					title="AINDA NÃO EXISTEM LINKS CADASTRADOS"
					titleClassName="text-base text-gray-500"
				/>
			</div>
		)
	}

	return (
		<div className="w-full mt-4">
			<ul className="w-full flex flex-col">
				{list.map(shortUrl => (
					<li key={shortUrl.id} className="w-full">
						<UrlShortenerCard shortUrl={shortUrl} />
					</li>
				))}
			</ul>
			<div ref={triggerRef} />
			{isFetchingNextPage && (
				<p className="text-center text-gray-500 py-4">
					Carregando mais links...
				</p>
			)}
		</div>
	)
}
