import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

const STORAGE_KEY = 'vedmino-favorites-v1'

const FavoritesContext = createContext(null)

function loadIds() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return []
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []
		return parsed.filter(id => typeof id === 'string')
	} catch {
		return []
	}
}

export function FavoritesProvider({ children }) {
	const [ids, setIds] = useState(loadIds)
	const [toast, setToast] = useState(null)

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
	}, [ids])

	const isFavorite = useCallback(productId => ids.includes(productId), [ids])

	const toggleFavorite = useCallback((productId, productName) => {
		setIds(prev => {
			const removing = prev.includes(productId)
			if (!removing && productName) {
				setToast({ name: productName })
			}
			return removing
				? prev.filter(id => id !== productId)
				: [...prev, productId]
		})
	}, [])

	const dismissToast = useCallback(() => setToast(null), [])

	const count = ids.length

	const value = useMemo(
		() => ({
			ids,
			count,
			isFavorite,
			toggleFavorite,
			toast,
			dismissToast,
		}),
		[ids, count, isFavorite, toggleFavorite, toast, dismissToast],
	)

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	)
}

export function useFavorites() {
	const ctx = useContext(FavoritesContext)
	if (!ctx) {
		throw new Error('useFavorites must be used within FavoritesProvider')
	}
	return ctx
}
