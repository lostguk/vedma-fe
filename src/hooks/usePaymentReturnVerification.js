import { useEffect, useState } from 'react'
import { getPaymentStatus } from '../api/payments'

const POLL_MS = 1600
/** Максимум запросов статуса (включая первый). */
const MAX_STATUS_FETCHES = 5

const PENDING_STATUSES = ['pending', 'registered', 'created']

export function isPendingStatus(status) {
	return PENDING_STATUSES.includes(status)
}

/**
 * Загружает актуальный статус платежа после возврата с банка; при pending — короткий poll.
 * @param {string|null|undefined} paymentPublicId — query payment (UUID)
 */
export function usePaymentReturnVerification(paymentPublicId) {
	const [phase, setPhase] = useState(() =>
		paymentPublicId ? 'loading' : 'skip',
	)
	const [payment, setPayment] = useState(null)
	const [fetchError, setFetchError] = useState(null)
	const [fetchCount, setFetchCount] = useState(0)

	useEffect(() => {
		if (!paymentPublicId) {
			setPhase('skip')
			setPayment(null)
			setFetchError(null)
			setFetchCount(0)
			return undefined
		}

		let cancelled = false
		let timeoutId
		let totalFetches = 0

		const run = async () => {
			if (cancelled) return
			totalFetches += 1
			setFetchCount(totalFetches)

			try {
				const res = await getPaymentStatus(paymentPublicId)
				const data = res.data?.data ?? res.data
				if (cancelled) return

				setPayment(data)
				setFetchError(null)

				if (
					data?.status === 'paid' ||
					data?.status === 'failed' ||
					data?.status === 'refunded'
				) {
					setPhase('ready')
					return
				}

				if (
					isPendingStatus(data?.status) &&
					totalFetches < MAX_STATUS_FETCHES
				) {
					timeoutId = setTimeout(() => {
						if (!cancelled) run()
					}, POLL_MS)
					return
				}

				setPhase('ready')
			} catch (err) {
				if (!cancelled) {
					setFetchError(err)
					setPhase('error')
				}
			}
		}

		setPhase('loading')
		setPayment(null)
		setFetchError(null)
		setFetchCount(0)
		run()

		return () => {
			cancelled = true
			if (timeoutId) clearTimeout(timeoutId)
		}
	}, [paymentPublicId])

	return { phase, payment, fetchError, fetchCount }
}
