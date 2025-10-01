import { Title } from './title'
import { Text } from '../ui/text'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	image: React.ReactNode
	title?: string
	titleClassName?: string
}

export function Output({
	image,
	title,
	children,
	titleClassName,
	className = '',
	...props
}: Props) {
	return (
		<div className={`flex flex-col gap-6 items-center ${className}`} {...props}>
			{image}

			{title && <Title className={titleClassName}>{title}</Title>}

			<Text className="text-balance text-center">{children}</Text>
		</div>
	)
}
