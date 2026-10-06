export function wholesaleOffer(source) {
	const minQty = Number(source?.wholesale_min_qty)
	const rawPrice = Number(source?.wholesale_price)
	const retail = Number(source?.price)
	if (!Number.isFinite(minQty) || Math.floor(minQty) < 2) return null
	if (!Number.isFinite(rawPrice) || rawPrice <= 0) return null
	if (!Number.isFinite(retail) || rawPrice >= retail) return null
	const stock = typeof source?.stock === 'number' ? source.stock : null
	if (stock !== null && stock < Math.floor(minQty)) return null
	return {
		minQty: Math.floor(minQty),
		price: Math.round(rawPrice),
	}
}

export function lineCharge(line) {
	const qty = Math.max(0, Math.floor(Number(line?.qty) || 0))
	const retail = Math.round(Number(line?.price) || 0)
	const offer = wholesaleOffer(line)
	const active = Boolean(offer && qty >= offer.minQty)
	const chargeUnit = active ? offer.price : retail
	return {
		chargeUnit,
		chargeTotal: chargeUnit * qty,
		wholesaleActive: active,
		wholesaleOffer: offer,
		unitsUntilWholesale: offer && !active ? offer.minQty - qty : 0,
	}
}

export function unitForQuantity(product, quantity) {
	return lineCharge({ ...product, qty: quantity })
}
