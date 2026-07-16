import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

const STORAGE_KEY = 'vedmino-cart-v2'

const CartContext = createContext(null)

function loadItems() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return []
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []
		return parsed.filter(
			x =>
				x &&
				(typeof x.id === 'string' || typeof x.id === 'number') &&
				typeof x.qty === 'number' &&
				x.qty > 0,
		)
	} catch {
		return []
	}
}

function getImage(product) {
	return (
		product.thumb_url ||
		product.preview_url ||
		product.image_url ||
		product.image ||
		''
	)
}

function getStock(product) {
	const s = typeof product === 'object' ? product.stock : undefined
	return typeof s === 'number' ? s : null
}

export function CartProvider({ children }) {
	const [items, setItems] = useState(loadItems)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [toast, setToast] = useState(null)

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
	}, [items])

	const getItemQty = useCallback(
		id => items.find(i => String(i.id) === String(id))?.qty ?? 0,
		[items],
	)

	const addToCart = useCallback((product, qty = 1) => {
		if (typeof product === 'object' && product.in_stock === false) return
		const productId = String(product.id || product)
		const stock = getStock(product)
		if (stock === 0) return
		const n = Math.max(1, Math.floor(Number(qty)) || 1)

		let added = false
		setItems(prev => {
			const idx = prev.findIndex(i => String(i.id) === productId)
			if (idx === -1) {
				const desiredQty = stock !== null ? Math.min(n, stock) : n
				if (desiredQty <= 0) return prev
				added = true
				const entry = {
					id: productId,
					qty: desiredQty,
					name: product.name || '',
					price: product.price || 0,
					old_price: product.old_price ?? product.oldPrice ?? null,
					image: typeof product === 'object' ? getImage(product) : '',
					slug: product.slug || productId,
					stock,
				}
				return [...prev, entry]
			}
			const next = [...prev]
			// Prefer fresh stock from the product, fall back to the value stored earlier.
			const effectiveStock = stock !== null ? stock : (next[idx].stock ?? null)
			const max = effectiveStock !== null ? effectiveStock : Infinity
			const newQty = Math.min(next[idx].qty + n, max)
			added = newQty > next[idx].qty
			next[idx] = { ...next[idx], qty: newQty, stock: effectiveStock }
			return next
		})

		if (added && typeof product === 'object' && product.name) {
			setToast({ key: Date.now(), name: product.name })
		}
	}, [])

	const updateQty = useCallback((id, qty) => {
		const productId = String(id)
		const q = Math.floor(Number(qty)) || 0
		if (q <= 0) {
			setItems(prev => prev.filter(i => String(i.id) !== productId))
			return
		}
		setItems(prev => {
			const idx = prev.findIndex(i => String(i.id) === productId)
			if (idx === -1) return prev
			const stock = prev[idx].stock
			const max = typeof stock === 'number' ? stock : Infinity
			const next = [...prev]
			next[idx] = { ...next[idx], qty: Math.min(q, max) }
			return next
		})
	}, [])

	const removeFromCart = useCallback(id => {
		setItems(prev => prev.filter(i => String(i.id) !== String(id)))
	}, [])

	const clearCart = useCallback(() => {
		setItems([])
	}, [])

	const totalItems = useMemo(
		() => items.reduce((s, i) => s + i.qty, 0),
		[items],
	)

	const totalPrice = useMemo(
		() => items.reduce((sum, line) => sum + (line.price || 0) * line.qty, 0),
		[items],
	)

	const openDrawer = useCallback(() => setDrawerOpen(true), [])
	const closeDrawer = useCallback(() => setDrawerOpen(false), [])
	const dismissToast = useCallback(() => setToast(null), [])

	const value = useMemo(
		() => ({
			items,
			drawerOpen,
			toast,
			addToCart,
			updateQty,
			removeFromCart,
			clearCart,
			getItemQty,
			totalItems,
			totalPrice,
			openDrawer,
			closeDrawer,
			dismissToast,
		}),
		[
			items,
			drawerOpen,
			toast,
			addToCart,
			updateQty,
			removeFromCart,
			clearCart,
			getItemQty,
			totalItems,
			totalPrice,
			openDrawer,
			closeDrawer,
			dismissToast,
		],
	)

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
	const ctx = useContext(CartContext)
	if (!ctx) {
		throw new Error('useCart must be used within CartProvider')
	}
	return ctx
}
