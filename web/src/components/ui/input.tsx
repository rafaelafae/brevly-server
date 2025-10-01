import { WarningIcon } from '@phosphor-icons/react'
import { forwardRef, useId } from 'react'
import { twMerge } from 'tailwind-merge'
import { Text } from '../ui/text'

interface Props extends Omit<React.ComponentProps<'input'>, 'children'> {
	label: string
	error?: string
	prefix?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
	({ label, error, prefix, className, id: customId, ...props }, ref) => {
		const generatedId = useId()

		const id = customId || generatedId

		return (
			<div className="flex flex-col gap-2">
				<label
					htmlFor={id}
					className={twMerge(
						'text-gray-500 transition-colors text-[0.625rem] leading-3.5',
						'peer-focus:text-blue-base peer-focus:font-bold',
						error && 'text-danger font-bold'
					)}
				>
					{label}
				</label>

				<div
					className={twMerge(
						'flex items-center justify-start px-4 h-12 rounded-md transition-colors border',
						'border-gray-300',
						'focus-within:border-blue-base',
						error && 'border-danger'
					)}
				>
					{prefix && (
						<Text size="md" className="text-gray-400 pointer-events-none pr-1">
							{prefix}
						</Text>
					)}
					<input
						ref={ref}
						className={twMerge(
							'peer w-full h-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400',
							className
						)}
						{...props}
					/>
				</div>

				{error && (
					<div className="flex items-center gap-2">
						<WarningIcon className="text-danger" size={14} />
						<p className="text-xs leading-4 text-gray-500">{error}</p>
					</div>
				)}
			</div>
		)
	}
)
