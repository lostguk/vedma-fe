import { useEffect, useRef, useState } from 'react'
import { resendVerification } from '../../api/auth'
import { Button } from '../ui'
import styles from './ResendVerification.module.css'

const DEFAULT_COOLDOWN_SECONDS = 60

function cooldownStorageKey(email) {
	return `vedmino-verify-resend-until:${email}`
}

function readRemaining(email) {
	if (!email) {
		return 0
	}
	try {
		const until = Number(sessionStorage.getItem(cooldownStorageKey(email)))
		if (!Number.isFinite(until) || until <= 0) {
			return 0
		}
		return Math.max(0, Math.ceil((until - Date.now()) / 1000))
	} catch {
		return 0
	}
}

function writeCooldown(email, seconds) {
	const sec = Math.max(0, Math.ceil(Number(seconds) || 0))
	if (!email || sec <= 0) {
		return
	}
	try {
		sessionStorage.setItem(
			cooldownStorageKey(email),
			String(Date.now() + sec * 1000),
		)
	} catch {
		// ignore quota / private mode
	}
}

function getApiError(error) {
	if (error.response?.data?.errors) {
		return Object.values(error.response.data.errors).flat().join('. ')
	}
	return (
		error.response?.data?.message ||
		'Не удалось отправить письмо. Попробуйте позже.'
	)
}

function parseRetryAfter(payload) {
	const fromBody = Number(payload?.retry_after ?? payload?.data?.retry_after)
	if (Number.isFinite(fromBody) && fromBody > 0) {
		return Math.ceil(fromBody)
	}
	return DEFAULT_COOLDOWN_SECONDS
}

function parseRetryAfterFromError(error) {
	const data = error.response?.data
	if (data?.retry_after != null || data?.data?.retry_after != null) {
		return parseRetryAfter(data)
	}
	const header =
		error.response?.headers?.['retry-after'] ??
		error.response?.headers?.['Retry-After']
	const fromHeader = Number(header)
	if (Number.isFinite(fromHeader) && fromHeader > 0) {
		return Math.ceil(fromHeader)
	}
	return DEFAULT_COOLDOWN_SECONDS
}

export default function ResendVerification({
	email = '',
	allowEmailEdit = false,
	hint,
	initialCooldownSeconds = 0,
}) {
	const [value, setValue] = useState(email)
	const [status, setStatus] = useState('idle')
	const [message, setMessage] = useState('')
	const [remaining, setRemaining] = useState(0)
	const inFlight = useRef(false)
	const appliedInitialEmail = useRef('')

	useEffect(() => {
		setValue(email)
		setStatus('idle')
		setMessage('')
	}, [email])

	useEffect(() => {
		const em = value.trim().toLowerCase()
		if (!em) {
			setRemaining(0)
			return
		}
		if (initialCooldownSeconds > 0 && appliedInitialEmail.current !== em) {
			if (readRemaining(em) === 0) {
				writeCooldown(em, initialCooldownSeconds)
			}
			appliedInitialEmail.current = em
		}
		setRemaining(readRemaining(em))
	}, [value, initialCooldownSeconds])

	useEffect(() => {
		if (remaining <= 0) {
			return undefined
		}
		const id = window.setInterval(() => {
			setRemaining(readRemaining(value.trim().toLowerCase()))
		}, 250)
		return () => window.clearInterval(id)
	}, [remaining, value])

	const coolingDown = remaining > 0

	const submit = async event => {
		event?.preventDefault()
		event?.stopPropagation()
		const em = value.trim().toLowerCase()
		if (inFlight.current || coolingDown) {
			return
		}
		if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
			setStatus('error')
			setMessage('Введите корректный email')
			return
		}

		inFlight.current = true
		setStatus('sending')
		setMessage('')
		try {
			const res = await resendVerification(em)
			const retryAfter = parseRetryAfter(res.data)
			writeCooldown(em, retryAfter)
			setRemaining(readRemaining(em))
			setStatus('sent')
			setMessage(
				res.data?.message || 'Письмо для подтверждения отправлено повторно.',
			)
		} catch (err) {
			if (err.response?.status === 429) {
				const retryAfter = parseRetryAfterFromError(err)
				writeCooldown(em, retryAfter)
				setRemaining(readRemaining(em))
			}
			setStatus('error')
			setMessage(getApiError(err))
		} finally {
			inFlight.current = false
		}
	}

	const buttonLabel = () => {
		if (status === 'sending') {
			return 'Отправка...'
		}
		if (coolingDown) {
			return `Отправить через ${remaining} сек.`
		}
		if (status === 'sent') {
			return 'Отправить ещё раз'
		}
		return 'Отправить письмо ещё раз'
	}

	return (
		<div className={styles.wrap}>
			{hint && <p className={styles.hint}>{hint}</p>}
			{allowEmailEdit && (
				<div className={styles.field}>
					<label className={styles.label} htmlFor='resend-email'>
						Email
					</label>
					<input
						id='resend-email'
						type='email'
						placeholder='example@mail.ru'
						value={value}
						onChange={e => {
							setValue(e.target.value)
							if (status !== 'idle') {
								setStatus('idle')
								setMessage('')
							}
						}}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								e.preventDefault()
								submit()
							}
						}}
						autoComplete='email'
						disabled={status === 'sending'}
					/>
				</div>
			)}
			<Button
				type='button'
				variant={allowEmailEdit ? 'primary' : 'ghost'}
				size='lg'
				fullWidth
				className={coolingDown ? styles.cooldown : undefined}
				loading={status === 'sending'}
				disabled={coolingDown || status === 'sending'}
				onClick={submit}
			>
				{buttonLabel()}
			</Button>
			{message && (
				<p
					className={status === 'error' ? styles.error : styles.success}
					role={status === 'error' ? 'alert' : 'status'}
				>
					{message}
				</p>
			)}
		</div>
	)
}
