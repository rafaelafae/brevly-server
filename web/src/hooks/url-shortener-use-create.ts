import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod/v4'

const schema = z.object({
	originalUrl: z
		.url('O link original é inválido')
		.nonempty('O link original é obrigatório'),
	name: z.string().refine(
		value => {
			if (value.length === 0) return true
			return value.length >= 6 && value.length <= 40
		},
		{
			message:
				'O link encurtado, se preenchido, deve ter entre 6 e 40 caracteres',
		}
	),
})

type FormProps = z.infer<typeof schema>

type urlShortenerUseCreateProps = {
	onSubmitSuccess: (data: FormProps) => Promise<void>
}

export const urlShortenerUseCreate = ({
	onSubmitSuccess,
}: urlShortenerUseCreateProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm<FormProps>({
		resolver: standardSchemaResolver(schema),
	})

	const onSubmit: SubmitHandler<FormProps> = async (data: FormProps) => {
		try {
			await onSubmitSuccess({
				name: data.name,
				originalUrl: data.originalUrl,
			})

			reset()
		} catch (err: unknown) {
			console.error('Error creating short URL:', err)
		}
	}

	return {
		register,
		errors,
		isSubmitting,
		onSubmit: handleSubmit(onSubmit),
		watch,
	}
}
