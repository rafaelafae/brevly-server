import { Card } from '../components/ui/card'
import { Output } from '../components/ui/output'
import { Url } from '../components/ui/url'
import { FRONTEND_URL } from '../store/env'

export function NotFound() {
	return (
		<Card size="lg" p="lg">
			<Output
				image={<img src="/404.svg" alt="Not Found" className="h-16" />}
				title="Link não encontrado"
			>
				O link que você está tentando acessar não existe, foi removido ou é uma
				URL inválida. Saiba mais em{' '}
				<Url href={FRONTEND_URL} target="_blank" rel="noopener noreferrer">
					brev.ly
				</Url>
				.
			</Output>
		</Card>
	)
}
