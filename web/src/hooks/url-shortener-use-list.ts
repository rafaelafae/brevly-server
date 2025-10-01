import type { UrlShortener } from '../interfaces/url-shortener'
import api from '../store/api'
import { useInfiniteQuery } from '@tanstack/react-query'

interface ListLinksResponse {
	total: number
	links: UrlShortener[]
}

const fetchLinks = async ({ pageParam = 1 }) => {
	const response = await api.get<ListLinksResponse>('/links', {
		params: {
			page: pageParam,
			pageSize: 10,
		},
	})
	return response.data
}

export const urlShortenerUseList = () => {
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['shortUrls'],
		queryFn: fetchLinks,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const linksLoaded = allPages.reduce(
				(acc, page) => acc + page.links.length,
				0
			)
			if (linksLoaded < lastPage.total) {
				return allPages.length + 1
			}
			return undefined
		},
	})

	const shortUrls = data?.pages.flatMap(page => page.links) ?? []

	return {
		shortUrls,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	}
}
