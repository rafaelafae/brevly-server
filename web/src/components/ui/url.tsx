interface Props extends React.ComponentProps<'a'> {}

export function Url({ className, ...props }: Props) {
	return (
		<a
			className={`text-blue-base hover:opacity-80 ${className ?? ''}`}
			{...props}
		/>
	)
}
