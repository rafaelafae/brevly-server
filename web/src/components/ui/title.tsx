import { twMerge } from 'tailwind-merge'

interface Props {
	children: React.ReactNode
	className?: string
}

export function Title({ children, className }: Props) {
	const finalClassName = twMerge('text-2xl font-bold text-gray-600', className)

	return <h1 className={finalClassName}>{children}</h1>
}
