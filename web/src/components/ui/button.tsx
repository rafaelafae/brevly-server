import { twMerge } from 'tailwind-merge'

const baseStyles =
	'flex items-center justify-center gap-2 rounded-md font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed'

interface Props extends React.ComponentProps<'button'> {
	variant: 'primary' | 'secondary'
	size?: 'default' | 'small' | 'icon'
	icon?: React.ReactNode
}

export const Button = ({
	variant,
	size = 'default',
	icon,
	className,
	children,
	...props
}: Props) => {
	const variantStyles = {
		primary:
			'bg-blue-base text-white hover:bg-blue-dark disabled:bg-blue-base/50',
		secondary:
			'bg-gray-200 text-gray-600 border border-transparent hover:border-blue-base disabled:bg-gray-100 disabled:text-gray-400',
	}

	const sizeStyles = {
		default: 'h-12 px-6 text-base',
		small: 'h-9 px-3 text-sm font-medium',
		icon: 'h-8 w-8 px-0',
	}

	return (
		<button
			className={twMerge(
				baseStyles,
				variantStyles[variant],
				sizeStyles[size],
				className
			)}
			{...props}
		>
			{icon}
			{children}
		</button>
	)
}
