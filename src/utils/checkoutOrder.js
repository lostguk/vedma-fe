const STORAGE_KEY = 'vedmino-checkout-created-order'

export function getCreatedCheckoutOrderId() {
	if (typeof sessionStorage === 'undefined') {
		return null
	}

	const id = Number(sessionStorage.getItem(STORAGE_KEY))
	return Number.isFinite(id) && id > 0 ? id : null
}

export function setCreatedCheckoutOrderId(orderId) {
	if (typeof sessionStorage === 'undefined') {
		return
	}

	sessionStorage.setItem(STORAGE_KEY, String(orderId))
}

export function clearCreatedCheckoutOrderId() {
	if (typeof sessionStorage === 'undefined') {
		return
	}

	sessionStorage.removeItem(STORAGE_KEY)
}
