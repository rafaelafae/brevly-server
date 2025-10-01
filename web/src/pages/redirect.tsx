import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card } from '../components/ui/card'
import { Output } from '../components/ui/output'
import { Url } from '../components/ui/url'
import { env } from '../store/env'

export function Redirect() {
	const params = useParams()
	const shortUrlId = params['short-url']

	const navigate = useNavigate()

	const redirectUrl = shortUrlId ? `${env.BACKEND_URL}/${shortUrlId}` : '/404'

	useEffect(() => {
		if (shortUrlId) {
			window.location.href = redirectUrl
		} else {
			navigate('/404')
		}
	}, [shortUrlId, navigate, redirectUrl])

	return (
		<div className="flex flex-col items-center justify-center h-full w-full">
			<Card size="lg" p="lg">
				<Output
					image={
						<img src="/Logo_Icon.svg" alt="Logo Brev.ly" className="h-16" />
					}
					title="Redirecionando..."
				>
					O link será aberto automaticamente em alguns instantes. <br />
					Não foi redirecionado?{' '}
					<Url href={redirectUrl} target="_blank" rel="noopener noreferrer">
						Acesse aqui
					</Url>
				</Output>
			</Card>
		</div>
	)
}
