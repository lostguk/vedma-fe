import apiClient from './client'

const PRODUCTS_PER_PAGE_MAX = 100

export function getProducts(params = {}) {
	return apiClient.get('/products', { params })
}

export function getProduct(slug) {
	return apiClient.get(`/products/${slug}`)
}

function chunk(items, size) {
	const chunks = []
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size))
	}
	return chunks
}

export async function getProductsByIds(ids) {
	const uniqueIds = [...new Set(ids.map(String).filter(Boolean))]
	if (uniqueIds.length === 0) return []

	const responses = await Promise.all(
		chunk(uniqueIds, PRODUCTS_PER_PAGE_MAX).map(idsChunk =>
			getProducts({
				ids: idsChunk.join(','),
				per_page: PRODUCTS_PER_PAGE_MAX,
			}),
		),
	)

	const byId = new Map()
	for (const res of responses) {
		for (const product of res.data?.data || []) {
			byId.set(String(product.id), product)
		}
	}

	return uniqueIds.map(id => byId.get(id)).filter(Boolean)
}
