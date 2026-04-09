import { forwardRef, useState } from 'react'
import { IconEye, IconEyeOff } from '../../Icons'
import styles from './PasswordInput.module.css'

const PasswordInput = forwardRef(function PasswordInput(
	{ className, wrapperClassName, disabled, ...inputProps },
	ref,
) {
	const [isVisible, setIsVisible] = useState(false)
	const inputClassName = [styles.input, className].filter(Boolean).join(' ')
	const fieldClassName = [styles.field, wrapperClassName]
		.filter(Boolean)
		.join(' ')

	return (
		<div className={fieldClassName}>
			<input
				ref={ref}
				{...inputProps}
				type={isVisible ? 'text' : 'password'}
				className={inputClassName}
				disabled={disabled}
			/>
			<button
				type='button'
				className={styles.toggle}
				onClick={() => setIsVisible(prev => !prev)}
				aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
				aria-pressed={isVisible}
				disabled={disabled}
			>
				{isVisible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
			</button>
		</div>
	)
})

export default PasswordInput
