import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { IconBag } from '../Icons'
import { FavoriteButton, LazyImage } from '../ui'
import styles from './ProductSection.module.css'

function formatPrice(n) {
	return Number(n).toLocaleString('ru-RU')
}

function getTag(product) {
	if (product.tag) return product.tag
	if (product.is_bestseller) return 'Хит продаж'
	if (product.is_new) return 'Новинка'
	return null
}

function getImage(product) {
	return (
		product.preview_url ||
		product.image_url ||
		product.thumb_url ||
		product.image ||
		''
	)
}

function getSlug(product) {
	return product.slug || product.id
}

function getOldPrice(product) {
	return product.old_price ?? product.oldPrice ?? null
}

export default function ProductCard({ product }) {
	const { getItemQty, addToCart, updateQty } = useCart()

	const productId = String(product.id)
	const qty = getItemQty(productId)
	const inCart = qty > 0
	const inStock = product.in_stock !== false
	const oldPrice = getOldPrice(product)
	const discount = oldPrice
		? Math.round((1 - product.price / oldPrice) * 100)
		: null
	const tag = getTag(product)
	const image = getImage(product)
	const slug = getSlug(product)

	const add = () => addToCart(product, 1)
	const remove = () => updateQty(productId, qty - 1)
	const inc = () => updateQty(productId, qty + 1)

	return (
		<article className={styles.card}>
			<div className={styles.cardImage}>
				<Link to={`/product/${slug}`} className={styles.cardImageLink}>
					<LazyImage
						src={image}
						alt={product.name}
						className={styles.cardImg}
					/>
					<div className={styles.cardImageOverlay} />
					{tag && inStock && <span className={styles.cardTag}>{tag}</span>}
					{discount && inStock && (
						<span className={styles.cardDiscount}>−{discount}%</span>
					)}
					{!inStock && (
						<div className={styles.outOfStockOverlay}>
							<span>Нет в наличии</span>
						</div>
					)}
				</Link>
				<FavoriteButton
					productId={productId}
					productName={product.name}
					size='sm'
					className={styles.cardFavBtn}
				/>
			</div>

			<div className={styles.cardBody}>
				<Link to={`/product/${slug}`} className={styles.cardTitleLink}>
					<h3 className={styles.cardTitle}>{product.name}</h3>
				</Link>

				<div className={styles.cardFooter}>
					<div className={styles.priceBlock}>
						{oldPrice && (
							<span className={styles.cardOldPrice}>
								{formatPrice(oldPrice)} ₽
							</span>
						)}
						<span className={styles.cardPrice}>
							{formatPrice(product.price)} ₽
						</span>
					</div>

					{!inStock ? (
						<span className={styles.outOfStockBtn}>Нет в наличии</span>
					) : !inCart ? (
						<button type='button' className={styles.buyBtn} onClick={add}>
							<IconBag size={16} />
							Купить
						</button>
					) : (
						<div className={styles.qtyWrap}>
							<button type='button' className={styles.qtyBtn} onClick={remove}>
								−
							</button>
							<span className={styles.qtyVal}>{qty}</span>
							<button type='button' className={styles.qtyBtn} onClick={inc}>
								+
							</button>
						</div>
					)}
				</div>
			</div>
		</article>
	)
}
