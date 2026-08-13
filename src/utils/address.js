export const ADDRESS_REQUIRED_MESSAGE = 'Укажите адрес доставки'
export const ADDRESS_SUGGEST_MESSAGE = 'Выберите адрес из подсказок'
export const ADDRESS_INCOMPLETE_MESSAGE =
	'Укажите полный адрес: населённый пункт, улица и дом'

export function isDeliverableAddress(dadataItem) {
	const data = dadataItem?.data
	if (!data) return false

	const level = Number(data.fias_level)
	if (Number.isFinite(level) && level >= 8) return true

	const locality = data.city || data.settlement
	const house = data.house
	if (!locality || !house) return false
	if (data.city && !data.street) return false

	return true
}

export function getAddressValidationError({
	address,
	addressConfirmed,
	addressData,
}) {
	if (!String(address || '').trim()) return ADDRESS_REQUIRED_MESSAGE
	if (!addressConfirmed) return ADDRESS_SUGGEST_MESSAGE
	if (addressData && !isDeliverableAddress(addressData)) {
		return ADDRESS_INCOMPLETE_MESSAGE
	}
	return ''
}
