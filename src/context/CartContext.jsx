import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { getCart, mergeCart, replaceCart } from '../api/cart'
import { lineCharge } from '../utils/pricing'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'vedmino-cart-v2'
const SYNC_FLAG_PREFIX = 'vedmino-cart-synced:'
const PUSH_DELAY_MS = 400

const CartContext = createContext(null)

const bootTasks = new Map()

function syncedKey(userId) {
	return `${SYNC_FLAG_PREFIX}${userId}`
}

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

function quantitySignature(items) {
	return items
		.map(item => `${String(item.id)}:${item.qty}`)
		.sort()
		.join('|')
}

function sameLines(left, right) {
	if (left.length !== right.length) return false
	const byId = new Map(right.map(item => [String(item.id), item]))
	return left.every(item => {
		const other = byId.get(String(item.id))
		if (!other) return false
		return (
			item.qty === other.qty &&
			item.price === other.price &&
			(item.old_price ?? null) === (other.old_price ?? null) &&
			(item.wholesale_min_qty ?? null) === (other.wholesale_min_qty ?? null) &&
			(item.wholesale_price ?? null) === (other.wholesale_price ?? null) &&
			Boolean(item.skips_delivery) === Boolean(other.skips_delivery) &&
			(item.stock ?? null) === (other.stock ?? null) &&
			item.name === other.name &&
			item.image === other.image &&
			item.slug === other.slug
		)
	})
}

function mapServerItems(data) {
	const source = Array.isArray(data?.items) ? data.items : []
	return source
		.map(item => {
			const qty = Math.floor(Number(item?.qty)) || 0
			if (!item || qty < 1 || item.id == null) return null
			return {
				id: String(item.id),
				qty,
				name: item.name || '',
				price: Number(item.price) || 0,
				old_price: item.old_price == null ? null : Number(item.old_price),
				wholesale_min_qty:
					item.wholesale_min_qty == null ? null : Number(item.wholesale_min_qty),
				wholesale_price:
					item.wholesale_price == null ? null : Number(item.wholesale_price),
				skips_delivery: Boolean(item.skips_delivery),
				image: item.image || '',
				slug: item.slug || String(item.id),
				stock: typeof item.stock === 'number' ? item.stock : null,
			}
		})
		.filter(Boolean)
}

function bootUserCart(userId, localItems) {
	const key = String(userId)
	const existing = bootTasks.get(key)
	if (existing) return existing

	const task = (async () => {
		const alreadySynced = localStorage.getItem(syncedKey(userId)) === '1'
		if (!alreadySynced && localItems.length > 0) {
			return mergeCart(localItems)
		}
		return getCart()
	})()

	bootTasks.set(key, task)
	task.catch(() => {
		bootTasks.delete(key)
	})
	return task
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

function readSkipsDelivery(product) {
	return Boolean(product?.skips_delivery)
}

function readWholesale(product) {
	if (!product || typeof product !== 'object') return {}
	if (!('wholesale_min_qty' in product) && !('wholesale_price' in product)) {
		return {}
	}
	return {
		wholesale_min_qty:
			product.wholesale_min_qty == null ? null : Number(product.wholesale_min_qty),
		wholesale_price:
			product.wholesale_price == null ? null : Number(product.wholesale_price),
	}
}

function getStock(product) {
	const s = typeof product === 'object' ? product.stock : undefined
	return typeof s === 'number' ? s : null
}

export function CartProvider({ children }) {
	const { user, loading } = useAuth()
	const [items, setItems] = useState(loadItems)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [toast, setToast] = useState(null)
	const [cartReady, setCartReady] = useState(false)
	const [syncTick, setSyncTick] = useState(0)

	const itemsRef = useRef(items)
	itemsRef.current = items
	const userRef = useRef(user)
	userRef.current = user
	const prevUserIdRef = useRef(undefined)
	const opRef = useRef(0)
	const canPushRef = useRef(false)
	const heldRef = useRef(false)
	const lastSyncedRef = useRef(quantitySignature(loadItems()))
	const syncGenRef = useRef(0)
	const pushTimerRef = useRef(null)
	const writeChainRef = useRef(Promise.resolve())

	const applyServerCart = useCallback(data => {
		const mapped = mapServerItems(data)
		lastSyncedRef.current = quantitySignature(mapped)
		setItems(prev => (sameLines(prev, mapped) ? prev : mapped))
		if (Array.isArray(data?.removed) && data.removed.length > 0) {
			setToast({
				key: Date.now(),
				message: 'Некоторые товары недоступны и убраны из корзины',
			})
		}
	}, [])

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
	}, [items])

	useEffect(() => {
		if (loading) return undefined

		const nextUserId = user?.id ?? null
		const prevUserId = prevUserIdRef.current
		if (prevUserId === nextUserId) return undefined
		prevUserIdRef.current = nextUserId

		if (nextUserId == null) {
			const loggingOut = typeof prevUserId === 'number'
			opRef.current += 1
			canPushRef.current = false
			heldRef.current = false
			clearTimeout(pushTimerRef.current)
			if (loggingOut) {
				lastSyncedRef.current = quantitySignature([])
				setItems([])
			}
			setCartReady(true)
			return undefined
		}

		const op = ++opRef.current
		const localItems = itemsRef.current.slice()
		const loggingIn = prevUserId === null
		canPushRef.current = false
		setCartReady(false)

		const request = loggingIn
			? mergeCart(localItems)
			: bootUserCart(nextUserId, localItems)

		request
			.then(res => {
				if (op !== opRef.current) return
				localStorage.setItem(syncedKey(nextUserId), '1')
				canPushRef.current = true
				applyServerCart(res.data?.data)
				setCartReady(true)
			})
			.catch(() => {
				if (op !== opRef.current) return
				canPushRef.current = false
				setCartReady(true)
			})

		return undefined
	}, [loading, user, applyServerCart])

	useEffect(() => {
		if (!user || !cartReady || !canPushRef.current || heldRef.current) {
			return undefined
		}

		const signature = quantitySignature(items)
		if (signature === lastSyncedRef.current) return undefined

		const snapshot = items
		const gen = ++syncGenRef.current
		clearTimeout(pushTimerRef.current)
		pushTimerRef.current = setTimeout(() => {
			const job = writeChainRef.current
				.catch(() => {})
				.then(async () => {
					if (gen !== syncGenRef.current || heldRef.current) return
					const res = await replaceCart(snapshot)
					if (gen !== syncGenRef.current || heldRef.current) return
					applyServerCart(res.data?.data)
				})
			writeChainRef.current = job.then(
				() => {},
				() => {},
			)
		}, PUSH_DELAY_MS)

		return () => clearTimeout(pushTimerRef.current)
	}, [items, user, cartReady, syncTick, applyServerCart])

	useEffect(() => {
		if (!user || !cartReady) return undefined

		const refresh = () => {
			if (document.visibilityState !== 'visible') return
			if (!canPushRef.current || heldRef.current) return
			if (quantitySignature(itemsRef.current) !== lastSyncedRef.current) return

			const op = opRef.current
			getCart()
				.then(res => {
					if (op !== opRef.current || heldRef.current) return
					if (quantitySignature(itemsRef.current) !== lastSyncedRef.current) {
						return
					}
					applyServerCart(res.data?.data)
				})
				.catch(() => {})
		}

		document.addEventListener('visibilitychange', refresh)
		return () => document.removeEventListener('visibilitychange', refresh)
	}, [user, cartReady, applyServerCart])

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
					...readWholesale(product),
					skips_delivery: readSkipsDelivery(product),
					image: typeof product === 'object' ? getImage(product) : '',
					slug: product.slug || productId,
					stock,
				}
				return [...prev, entry]
			}
			const next = [...prev]
			const effectiveStock = stock !== null ? stock : (next[idx].stock ?? null)
			const max = effectiveStock !== null ? effectiveStock : Infinity
			const newQty = Math.min(next[idx].qty + n, max)
			added = newQty > next[idx].qty
			next[idx] = {
				...next[idx],
				qty: newQty,
				stock: effectiveStock,
				price: product.price ?? next[idx].price,
				old_price: product.old_price ?? product.oldPrice ?? next[idx].old_price,
				...readWholesale(product),
				skips_delivery: readSkipsDelivery(product),
			}
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
		clearTimeout(pushTimerRef.current)
		syncGenRef.current += 1
		heldRef.current = false
		lastSyncedRef.current = quantitySignature([])
		setItems([])
	}, [])

	const holdCartSync = useCallback(async () => {
		heldRef.current = true
		clearTimeout(pushTimerRef.current)
		syncGenRef.current += 1
		await writeChainRef.current
	}, [])

	const releaseCartSync = useCallback(() => {
		heldRef.current = false
		setSyncTick(tick => tick + 1)
	}, [])

	const totalItems = useMemo(
		() => items.reduce((s, i) => s + i.qty, 0),
		[items],
	)

	const totalPrice = useMemo(
		() => items.reduce((sum, line) => sum + lineCharge(line).chargeTotal, 0),
		[items],
	)

	const openDrawer = useCallback(() => setDrawerOpen(true), [])
	const closeDrawer = useCallback(() => setDrawerOpen(false), [])
	const dismissToast = useCallback(() => setToast(null), [])

	const value = useMemo(
		() => ({
			items,
			cartReady,
			drawerOpen,
			toast,
			addToCart,
			updateQty,
			removeFromCart,
			clearCart,
			holdCartSync,
			releaseCartSync,
			getItemQty,
			totalItems,
			totalPrice,
			openDrawer,
			closeDrawer,
			dismissToast,
		}),
		[
			items,
			cartReady,
			drawerOpen,
			toast,
			addToCart,
			updateQty,
			removeFromCart,
			clearCart,
			holdCartSync,
			releaseCartSync,
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
