import { useCallback, useEffect, useRef, useState } from 'react'
import { suggestAddress } from '../../../api/dadata'
import styles from './AddressInput.module.css'

export default function AddressInput({
	id,
	value,
	onChange,
	onSelect,
	placeholder,
	disabled,
	error,
}) {
	const [suggestions, setSuggestions] = useState([])
	const [open, setOpen] = useState(false)
	const wrapRef = useRef(null)
	const timerRef = useRef(null)

	const fetchSuggestions = useCallback(query => {
		clearTimeout(timerRef.current)
		if (!query || query.length < 3) {
			setSuggestions([])
			setOpen(false)
			return
		}
		timerRef.current = setTimeout(() => {
			suggestAddress(query, 7)
				.then(res => {
					const items = res.data?.data?.suggestions || res.data?.data || []
					setSuggestions(Array.isArray(items) ? items : [])
					setOpen(items.length > 0)
				})
				.catch(() => setSuggestions([]))
		}, 300)
	}, [])

	useEffect(() => {
		const handleClick = e => {
			if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
		}
		document.addEventListener('mousedown', handleClick)
		return () => document.removeEventListener('mousedown', handleClick)
	}, [])

	const handleChange = e => {
		const v = e.target.value
		onChange(v, null)
		fetchSuggestions(v)
	}

	const handleSelect = item => {
		const text = item.value || item.unrestricted_value || ''
		onChange(text, item)
		onSelect?.(item)
		setOpen(false)
		setSuggestions([])
	}

	return (
		<div className={styles.wrap} ref={wrapRef}>
			<input
				id={id}
				type='text'
				value={value}
				onChange={handleChange}
				onFocus={() => suggestions.length > 0 && setOpen(true)}
				placeholder={placeholder}
				disabled={disabled}
				autoComplete='off'
				className={error ? styles.inputError : ''}
			/>
			{error && <p className={styles.error}>{error}</p>}
			{open && suggestions.length > 0 && (
				<ul className={styles.dropdown}>
					{suggestions.map((item, i) => (
						<li key={i}>
							<button
								type='button'
								className={styles.option}
								onClick={() => handleSelect(item)}
							>
								{item.value || item.unrestricted_value || String(item)}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
