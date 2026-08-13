import { IconMapPin, IconTruck } from '../../components/Icons'
import { AddressInput } from '../../components/ui'
import styles from './CheckoutPage.module.css'

export default function CheckoutDeliverySection({
	form,
	errors,
	addressError,
	onAddressChange,
	onAddressSelect,
}) {
	return (
		<>
			<section className={styles.section}>
				<div className={styles.sectionTitleRow}>
					<IconMapPin size={22} className={styles.sectionIcon} />
					<h2 className={styles.sectionTitle}>Адрес доставки</h2>
				</div>
				<div className={styles.field}>
					<label className={styles.label} htmlFor='co-address'>
						Адрес *
					</label>
					<AddressInput
						id='co-address'
						value={form.address}
						onChange={onAddressChange}
						onSelect={onAddressSelect}
						placeholder='Начните вводить адрес...'
						error={addressError || errors.address}
					/>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionTitleRow}>
					<IconTruck size={22} className={styles.sectionIcon} />
					<h2 className={styles.sectionTitle}>Доставка</h2>
				</div>
				<div className={styles.deliveryCard}>
					<div className={styles.deliveryName}>Почта России</div>
					<p className={styles.deliveryDesc}>
						Отправляем заказанные товары заказной бандеролью или посылкой.
						Точную стоимость рассчитаем после сборки заказа и сообщим на email
						или по телефону.
					</p>
				</div>
			</section>
		</>
	)
}
