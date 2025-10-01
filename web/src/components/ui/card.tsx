import { twMerge } from 'tailwind-merge'

interface Props extends React.ComponentProps<'div'> {
	children: React.ReactNode
	p?: 'md' | 'lg'
	size?: 'md' | 'lg' | 'fill'
}

const paddingStyles = {
	md: 'p-8',
	lg: 'py-16 px-12',
}

const sizeStyles = {
	fill: '',
	md: 'max-w-full lg:max-w-[23.75rem] lg:min-w-[23.75rem]',
	lg: 'max-w-full w-full lg:max-w-[36.25rem] lg:min-w-[36.25rem]',
}

export function Card({
	children,
	className,
	size = 'md',
	p = 'md',
	...props
}: Props) {
	return (
		<div
			className={twMerge(
				'rounded-lg shadow-xs bg-gray-100 w-full',
				sizeStyles[size],
				paddingStyles[p],
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
}
