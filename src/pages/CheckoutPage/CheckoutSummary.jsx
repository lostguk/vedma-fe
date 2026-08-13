import { IconCheck } from '../../components/Icons'
import styles from './CheckoutPage.module.css'

export default function CheckoutSummary({
	items,
	subtotal,
	discountAmount,
	deliveryPrice,
	deliveryLoading,
	total,
	promoApplied,
	promoInput,
	setPromoInput,
	promoApplying,
	promoError,
	setPromoError,
	applyPromo,
	removePromo,
	updateQty,
	removeFromCart,
	submitting,
}) {
	return (
		<aside className={styles.sidebar} aria-label='Корзина и итого'>
			<div className={styles.sideCard}>
				<h3 className={styles.sideTitle}>Корзина</h3>
				<ul className={styles.sideList}>
					{items.map(line => (
						<li key={line.id} className={styles.sideItem}>
							{line.image && (
								<img src={line.image} alt='' className={styles.sideImg} />
							)}
							<div className={styles.sideItemBody}>
								<div className={styles.sideItemTop}>
									<span className={styles.sideItemName}>{line.name}</span>
									<button
										type='button'
										className={styles.sideRemove}
										onClick={() => removeFromCart(line.id)}
										aria-label='Удалить'
									>
										×
									</button>
								</div>
								<div className={styles.sideItemBottom}>
									<div className={styles.sideQty}>
										<button
											type='button'
											onClick={() => updateQty(line.id, line.qty - 1)}
											aria-label='Меньше'
										>
											−
										</button>
										<span>{line.qty}</span>
										<button
											type='button'
											onClick={() => updateQty(line.id, line.qty + 1)}
											disabled={
												typeof line.stock === 'number' && line.qty >= line.stock
											}
											title={
												typeof line.stock === 'number' && line.qty >= line.stock
													? 'Больше нет в наличии'
													: undefined
											}
											aria-label='Больше'
										>
											+
										</button>
									</div>
									<div className={styles.sidePriceCol}>
										<span className={styles.sidePrice}>
											{((line.price || 0) * line.qty).toLocaleString('ru-RU')} ₽
										</span>
										<span className={styles.sidePer}>
											{line.qty} шт ×{' '}
											{Number(line.price || 0).toLocaleString('ru-RU')} ₽
										</span>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>

				<div className={styles.totals}>
					<div className={styles.totalRow}>
						<span>Стоимость товаров</span>
						<span>{subtotal.toLocaleString('ru-RU')} ₽</span>
					</div>
					<div className={styles.totalRow}>
						<span>Доставка</span>
						<span
							className={deliveryPrice != null ? undefined : styles.totalMuted}
						>
							{deliveryLoading
								? 'Считаем...'
								: deliveryPrice != null
									? deliveryPrice === 0
										? 'Бесплатно'
										: `${Number(deliveryPrice).toLocaleString('ru-RU')} ₽`
									: 'Укажите полный адрес'}
						</span>
					</div>
					{discountAmount > 0 && (
						<div className={styles.totalRow}>
							<span>По промокоду {promoApplied?.code}</span>
							<span className={styles.discountVal}>
								−{discountAmount.toLocaleString('ru-RU')} ₽
							</span>
						</div>
					)}
					<div className={`${styles.totalRow} ${styles.totalGrand}`}>
						<span>Итого</span>
						<span>{total.toLocaleString('ru-RU')} ₽</span>
					</div>
				</div>

				{promoApplied ? (
					<div className={styles.promoApplied}>
						<div className={styles.promoAppliedMain}>
							<span className={styles.promoAppliedIcon} aria-hidden>
								<IconCheck size={18} />
							</span>
							<div className={styles.promoAppliedText}>
								<span className={styles.promoAppliedCode}>
									{promoApplied.code}
								</span>
								<span className={styles.promoAppliedDesc}>
									{promoApplied.description}
								</span>
							</div>
						</div>
						<button
							type='button'
							className={styles.promoRemoveBtn}
							onClick={removePromo}
						>
							Убрать
						</button>
					</div>
				) : (
					<div className={styles.promoRow}>
						<input
							type='text'
							className={styles.promoInput}
							placeholder='Введите промокод'
							value={promoInput}
							disabled={promoApplying}
							autoComplete='off'
							spellCheck={false}
							onChange={e => {
								setPromoInput(e.target.value)
								if (promoError) setPromoError('')
							}}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									applyPromo()
								}
							}}
						/>
						<button
							type='button'
							className={`${styles.promoBtn} ${promoApplying ? styles.promoBtnLoading : ''}`}
							onClick={applyPromo}
							disabled={promoApplying}
						>
							{promoApplying ? 'Проверяем…' : 'Применить'}
						</button>
					</div>
				)}
				{promoError && <p className={styles.promoError}>{promoError}</p>}

				<button
					type='submit'
					form='checkout-order-form'
					className={styles.sideSubmit}
					disabled={submitting}
				>
					{submitting ? 'Оформляем...' : 'Оформить заказ'}
				</button>
			</div>
		</aside>
	)
}
