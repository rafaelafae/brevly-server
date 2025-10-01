import { twMerge } from 'tailwind-merge'

interface Props extends React.ComponentProps<'p'> {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeStyles = {
	xs: 'text-xxs leading-3.5',
	sm: 'text-xs leading-4',
	md: 'text-sm leading-5 font-semibold',
	lg: 'text-lg leading-6 font-bold',
	xl: 'text-2xl leading-8 font-bold',
}

export function Text({ children, className, size = 'md', ...props }: Props) {
	return (
		<p
			className={twMerge('text-gray-500', sizeStyles[size], className)}
			{...props}
		>
			{children}
		</p>
	)
}
