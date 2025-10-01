import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Title } from '../components/ui/title'
import { UrlShortenerList } from '../components/url-shortener-list'
import { urlShortenerUseCreate } from '../hooks/url-shortener-use-create'
import { urlShortenerUseDownload } from '../hooks/url-shortener-use-download'
import { urlShortenerUseList } from '../hooks/url-shortener-use-list'
import { createtUrlShortener } from '../http/create-url-shortener'
import { env } from '../store/env'

export function Home() {
	const { shortUrls, refetch } = urlShortenerUseList()
	const { handleDownloadShortUrlReport, isLoadingReport } =
		urlShortenerUseDownload()

	const { register, onSubmit, isSubmitting, errors, watch } =
		urlShortenerUseCreate({
			onSubmitSuccess: async data => {
				try {
					await createtUrlShortener({
						name: data.name,
						originalUrl: data.originalUrl,
					})

					await refetch()
					toast.success('Link salvo com sucesso!')
				} catch (error) {
					console.error(error)
					if (error instanceof AxiosError && error.response?.status === 409) {
						toast.error('Este código de link customizado já está em uso.')
					} else {
						toast.error('Ocorreu um erro ao salvar o link.')
					}
				}
			},
		})

	const originalUrlValue = watch('originalUrl')

	const isButtonDisable = !originalUrlValue?.trim() || isSubmitting

	return (
		<div className="w-full lg:w-[980px] flex flex-col gap-6 items-start">
			<img src="/Logo.svg" alt="Logo Brev.ly" className="h-6" />

			<div className="w-full flex flex-col lg:flex-row gap-5 items-start">
				<Card size="md">
					<form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
						<Title>Novo link</Title>

						<div className="w-full flex flex-col gap-4">
							<Input
								label="LINK ORIGINAL"
								placeholder="linkedin.com/in/myprofile"
								error={errors.originalUrl?.message}
								{...register('originalUrl')}
							/>

							<Input
								label="LINK ENCURTADO"
								prefix={`${env.BACKEND_URL}/`}
								error={errors.name?.message}
								{...register('name')}
							/>
						</div>

						<Button type="submit" disabled={isButtonDisable} variant="primary">
							Salvar link
						</Button>
					</form>
				</Card>

				<Card size="fill">
					<div className="w-full flex flex-row justify-between items-center">
						<Title>Meus links</Title>

						<Button
							icon={<DownloadSimpleIcon size={16} className="text-gray-600" />}
							variant="secondary"
							size="small"
							disabled={shortUrls.length === 0 || isLoadingReport}
							onClick={handleDownloadShortUrlReport}
						>
							Baixar CSV
						</Button>
					</div>
					<div
						className="w-full h-[300px] overflow-y-auto"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
					>
						<UrlShortenerList list={shortUrls} />
					</div>
				</Card>
			</div>
		</div>
	)
}
