import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getOrders } from '../../api/orders'
import { createPayment } from '../../api/payments'
import {
	addMessage,
	createTopic,
	getTopic,
	getTopics,
	getUnreadCount,
} from '../../api/topics'
import {
	IconArrowRight,
	IconBag,
	IconChat,
	IconCheck,
	IconChevronDown,
	IconMail,
	IconPaperclip,
	IconSend,
	IconTruck,
	IconUser,
	IconX,
} from '../../components/Icons'
import Lightbox from '../../components/Lightbox/Lightbox'
import {
	AddressInput,
	Breadcrumbs,
	Button,
	PageShell,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import styles from './ProfilePage.module.css'

const TABS = [
	{ id: 'info', path: '/profile', label: 'Мои данные', icon: IconUser },
	{
		id: 'orders',
		path: '/profile/orders',
		label: 'История заказов',
		icon: IconBag,
	},
	{ id: 'chat', path: '/profile/chat', label: 'Чат с админом', icon: IconChat },
	{
		id: 'password',
		path: '/profile/password',
		label: 'Сменить пароль',
		icon: null,
	},
]

function getApiErrors(error) {
	if (error.response?.data?.errors) {
		return Object.values(error.response.data.errors).flat().join('. ')
	}
	return error.response?.data?.message || 'Произошла ошибка'
}

/* ── TabInfo ── */
function isFullAddress(dadataItem) {
	if (!dadataItem?.data) return false
	const { street, house, city, settlement } = dadataItem.data
	return Boolean(street && house && (city || settlement))
}

function TabInfo({ user, updateProfile }) {
	const [form, setForm] = useState({
		lastName: user.last_name || '',
		firstName: user.first_name || '',
		middleName: user.middle_name || '',
		phone: user.phone || '',
		email: user.email || '',
		address: user.address || '',
	})
	const [addressData, setAddressData] = useState(null)
	const [addressConfirmed, setAddressConfirmed] = useState(
		Boolean(user.address),
	)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [error, setError] = useState('')
	const [addressError, setAddressError] = useState('')

	useEffect(() => {
		if (saved) {
			const t = setTimeout(() => setSaved(false), 2500)
			return () => clearTimeout(t)
		}
	}, [saved])

	const setField = (key, val) => {
		setForm(p => ({ ...p, [key]: val }))
		setSaved(false)
		setError('')
	}

	const handleAddressChange = (text, dadataItem) => {
		setForm(p => ({ ...p, address: text }))
		setAddressError('')
		setSaved(false)
		if (dadataItem) {
			setAddressData(dadataItem)
			setAddressConfirmed(true)
		} else {
			setAddressConfirmed(false)
			setAddressData(null)
		}
	}

	const handleAddressSelect = dadataItem => {
		setAddressData(dadataItem)
		setAddressConfirmed(true)
		setAddressError('')
	}

	const handleSave = async e => {
		e.preventDefault()
		setError('')
		setAddressError('')

		const phoneDigits = form.phone.replace(/\D/g, '')
		if (form.phone && phoneDigits.length !== 11) {
			setError('Введите полный номер телефона: +7 (XXX) XXX-XX-XX')
			return
		}
		if (!form.address.trim()) {
			setAddressError('Укажите адрес доставки')
			return
		}
		if (!addressConfirmed) {
			setAddressError('Выберите адрес из подсказок')
			return
		}
		if (addressData && !isFullAddress(addressData)) {
			setAddressError('Укажите полный адрес: город, улица и дом')
			return
		}

		setSaving(true)
		try {
			await updateProfile({
				lastName: form.lastName.trim(),
				firstName: form.firstName.trim(),
				middleName: form.middleName.trim(),
				email: form.email.trim(),
				phone: form.phone.trim(),
				address: form.address.trim(),
			})
			setSaved(true)
		} catch (err) {
			setError(getApiErrors(err))
		} finally {
			setSaving(false)
		}
	}

	return (
		<form className={styles.tabForm} onSubmit={handleSave}>
			{error && <p className={styles.formError}>{error}</p>}
			<div className={styles.fieldRow3}>
				<div className={styles.field}>
					<label className={styles.fieldLabel}>Фамилия *</label>
					<input
						value={form.lastName}
						onChange={e => setField('lastName', e.target.value)}
						placeholder='Иванова'
						disabled={saving}
					/>
				</div>
				<div className={styles.field}>
					<label className={styles.fieldLabel}>Имя *</label>
					<input
						value={form.firstName}
						onChange={e => setField('firstName', e.target.value)}
						placeholder='Анна'
						disabled={saving}
					/>
				</div>
				<div className={styles.field}>
					<label className={styles.fieldLabel}>Отчество</label>
					<input
						value={form.middleName}
						onChange={e => setField('middleName', e.target.value)}
						placeholder='Сергеевна'
						disabled={saving}
					/>
				</div>
			</div>
			<div className={styles.fieldRow2}>
				<div className={styles.field}>
					<label className={styles.fieldLabel}>Телефон</label>
					<input
						type='tel'
						value={form.phone}
						onChange={e => {
							let v = e.target.value.replace(/[^\d+() -]/g, '')
							if (v && !v.startsWith('+7')) {
								const digits = v.replace(/\D/g, '')
								if (digits.startsWith('8')) v = '+7' + digits.slice(1)
								else if (digits.startsWith('7')) v = '+' + digits
								else v = '+7' + digits
							}
							const digits = v.replace(/\D/g, '').slice(0, 11)
							if (digits.length <= 1) {
								setField('phone', digits.length ? '+7' : '')
								return
							}
							let formatted = '+7'
							if (digits.length > 1) formatted += ' (' + digits.slice(1, 4)
							if (digits.length >= 4) formatted += ') '
							if (digits.length > 4) formatted += digits.slice(4, 7)
							if (digits.length > 7) formatted += '-' + digits.slice(7, 9)
							if (digits.length > 9) formatted += '-' + digits.slice(9, 11)
							setField('phone', formatted)
						}}
						placeholder='+7 (900) 123-45-67'
						disabled={saving}
					/>
				</div>
				<div className={styles.field}>
					<label className={styles.fieldLabel}>Email *</label>
					<input
						type='email'
						value={form.email}
						onChange={e => setField('email', e.target.value)}
						placeholder='email@example.com'
						disabled={saving}
					/>
				</div>
			</div>
			<div className={styles.field}>
				<label className={styles.fieldLabel}>Адрес доставки *</label>
				<AddressInput
					value={form.address}
					onChange={handleAddressChange}
					onSelect={handleAddressSelect}
					placeholder='Начните вводить адрес...'
					disabled={saving}
					error={addressError}
				/>
			</div>
			<div className={styles.formActions}>
				<Button type='submit' variant='primary' size='lg' disabled={saving}>
					{saved ? (
						<>
							<IconCheck size={18} /> Сохранено
						</>
					) : saving ? (
						'Сохранение...'
					) : (
						'Сохранить изменения'
					)}
				</Button>
			</div>
		</form>
	)
}

/* ── TabOrders ── */
const STATUS_MAP = {
	new: { label: 'Новый', cls: 'statusPending', color: 'var(--color-accent)' },
	payment_pending: {
		label: 'Ожидает оплату',
		cls: 'statusPending',
		color: 'var(--color-accent)',
	},
	paid: {
		label: 'Оплачен',
		cls: 'statusDelivered',
		color: 'var(--color-primary)',
	},
	payment_failed: {
		label: 'Ошибка оплаты',
		cls: 'statusReturned',
		color: '#b42318',
	},
	refunded: { label: 'Возврат', cls: 'statusReturned', color: '#b42318' },
	cancelled: {
		label: 'Отменён',
		cls: 'statusReturned',
		color: 'var(--color-text-muted)',
	},
}

const PAYABLE_STATUSES = ['new', 'payment_pending', 'payment_failed']
const REPEATABLE_STATUSES = ['paid', 'refunded', 'cancelled']

function OrderCard({ order, onPay, onRepeat }) {
	const [open, setOpen] = useState(false)
	const [paying, setPaying] = useState(false)
	const st = STATUS_MAP[order.status_code] || {
		label: order.status || 'Неизвестен',
		cls: 'statusPending',
		color: 'var(--color-text-muted)',
	}
	const canPay = PAYABLE_STATUSES.includes(order.status_code)
	const canRepeat = REPEATABLE_STATUSES.includes(order.status_code)
	const items = order.items || []
	const subtotal =
		order.total_price_without_discount ||
		items.reduce((s, i) => s + (i.total || i.price * i.count), 0)
	const total = order.total_price_with_discount || order.total_price || subtotal
	const discount = subtotal - total + (order.delivery_price || 0)
	const date = order.created_at
		? new Date(order.created_at).toLocaleDateString('ru-RU')
		: ''

	return (
		<div className={styles.orderCard}>
			<button
				className={styles.orderHeader}
				onClick={() => setOpen(!open)}
				type='button'
			>
				<div className={styles.orderHeaderLeft}>
					<span className={styles.orderId}>#{order.id}</span>
					<span className={styles.orderDate}>{date}</span>
				</div>
				<div className={styles.orderHeaderRight}>
					<span className={`${styles.orderStatus} ${styles[st.cls]}`}>
						{order.status || st.label}
					</span>
					<span className={styles.orderTotal}>
						{Number(total).toLocaleString('ru-RU')} ₽
					</span>
					<IconChevronDown
						size={16}
						className={`${styles.orderChevron} ${open ? styles.orderChevronOpen : ''}`}
					/>
				</div>
			</button>
			{open && (
				<div className={styles.orderBody}>
					<div className={styles.orderInfo}>
						<div className={styles.orderInfoItem}>
							<span className={styles.orderInfoLabel}>Получатель</span>
							<span>
								{[order.last_name, order.first_name, order.middle_name]
									.filter(Boolean)
									.join(' ')}
							</span>
						</div>
						{order.address && (
							<div className={styles.orderInfoItem}>
								<span className={styles.orderInfoLabel}>Адрес</span>
								<span>{order.address}</span>
							</div>
						)}
						{order.delivery_type && (
							<div className={styles.orderInfoItem}>
								<span className={styles.orderInfoLabel}>Способ доставки</span>
								<span>
									{order.delivery_type === 'Cdek' ? 'СДЭК' : 'Почта России'}
								</span>
							</div>
						)}
						{order.phone && (
							<div className={styles.orderInfoItem}>
								<span className={styles.orderInfoLabel}>Телефон</span>
								<span>{order.phone}</span>
							</div>
						)}
					</div>
					<div className={styles.orderItems}>
						{items.map(item => (
							<div key={item.id} className={styles.orderItem}>
								{item.product?.thumb_url && (
									<img
										src={item.product.thumb_url}
										alt={item.name}
										className={styles.orderItemImg}
									/>
								)}
								<div className={styles.orderItemInfo}>
									<span className={styles.orderItemName}>{item.name}</span>
									<span className={styles.orderItemMeta}>
										{item.count} шт &times;{' '}
										{Number(item.price).toLocaleString('ru-RU')} ₽
									</span>
								</div>
								<span className={styles.orderItemTotal}>
									{Number(item.total || item.price * item.count).toLocaleString(
										'ru-RU',
									)}{' '}
									₽
								</span>
							</div>
						))}
					</div>
					<div className={styles.orderSummary}>
						<div className={styles.orderSummaryRow}>
							<span>Товары</span>
							<span>{Number(subtotal).toLocaleString('ru-RU')} ₽</span>
						</div>
						{order.delivery_price != null && (
							<div className={styles.orderSummaryRow}>
								<span>
									<IconTruck
										size={14}
										style={{ verticalAlign: '-2px', marginRight: 4 }}
									/>
									Доставка
								</span>
								<span>
									{order.delivery_price === 0
										? 'Бесплатно'
										: `${Number(order.delivery_price).toLocaleString('ru-RU')} ₽`}
								</span>
							</div>
						)}
						{discount > 0 && order.promo_code && (
							<div
								className={`${styles.orderSummaryRow} ${styles.orderDiscount}`}
							>
								<span>
									Промокод <strong>{order.promo_code}</strong>
								</span>
								<span>−{Number(discount).toLocaleString('ru-RU')} ₽</span>
							</div>
						)}
						<div className={`${styles.orderSummaryRow} ${styles.orderGrand}`}>
							<span>Итого</span>
							<span>{Number(total).toLocaleString('ru-RU')} ₽</span>
						</div>
					</div>
					<div className={styles.orderActions}>
						{canPay && (
							<Button
								variant='primary'
								size='sm'
								disabled={paying}
								onClick={async () => {
									setPaying(true)
									try {
										await onPay(order.id)
									} finally {
										setPaying(false)
									}
								}}
							>
								{paying ? 'Перенаправляем...' : 'Оплатить'}
							</Button>
						)}
						{canRepeat && (
							<Button variant='ghost' size='sm' onClick={() => onRepeat(order)}>
								Повторить заказ
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

function TabOrders() {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const { addToCart, clearCart } = useCart()

	useEffect(() => {
		getOrders()
			.then(res => {
				const data = res.data?.data?.data || res.data?.data || []
				setOrders(Array.isArray(data) ? data : [])
			})
			.catch(() => setOrders([]))
			.finally(() => setLoading(false))
	}, [])

	const handlePay = async orderId => {
		try {
			const res = await createPayment({
				orderId,
				successUrl: `${window.location.origin}/payment-success?order_id=${orderId}`,
				failUrl: `${window.location.origin}/payment-error?order_id=${orderId}`,
			})
			const payment = res.data?.data ?? res.data
			if (payment.payment_url) {
				window.location.href = payment.payment_url
			} else {
				toast.error('Не удалось получить ссылку на оплату')
			}
		} catch {
			toast.error('Ошибка при создании платежа')
		}
	}

	const handleRepeat = order => {
		clearCart()
		const items = order.items || []
		items.forEach(item => {
			addToCart(
				{
					id: item.product_id || item.id,
					name: item.name,
					price: item.price,
					slug: item.product?.slug || '',
					image: item.product?.thumb_url || '',
				},
				item.count,
			)
		})
		toast.success('Товары добавлены в корзину')
		navigate('/checkout')
	}

	if (loading)
		return (
			<div className={styles.emptyTab}>
				<p className={styles.emptyTabTitle}>Загрузка...</p>
			</div>
		)

	if (orders.length === 0) {
		return (
			<div className={styles.emptyTab}>
				<IconBag size={48} strokeWidth={1} className={styles.emptyTabIcon} />
				<p className={styles.emptyTabTitle}>Заказов пока нет</p>
				<p className={styles.emptyTabText}>
					Когда вы оформите заказ, он появится здесь
				</p>
			</div>
		)
	}

	return (
		<div className={styles.ordersList}>
			{orders.map(order => (
				<OrderCard
					key={order.id}
					order={order}
					onPay={handlePay}
					onRepeat={handleRepeat}
				/>
			))}
		</div>
	)
}

/* ── TabChat ── */
function useFileAttach() {
	const [files, setFiles] = useState([])
	const pickFiles = () => {
		const inp = document.createElement('input')
		inp.type = 'file'
		inp.accept = 'image/jpeg,image/png,image/webp,application/pdf'
		inp.multiple = true
		inp.onchange = () => {
			const picked = Array.from(inp.files).map(f => ({
				file: f,
				name: f.name,
				preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
			}))
			setFiles(prev => [...prev, ...picked])
		}
		inp.click()
	}
	const removeFile = idx => setFiles(prev => prev.filter((_, i) => i !== idx))
	const clearFiles = () => setFiles([])
	const getRawFiles = () => files.map(f => f.file)
	return { files, pickFiles, removeFile, clearFiles, getRawFiles }
}

function FilePreviewList({ files, onRemove }) {
	if (!files.length) return null
	return (
		<div className={styles.attachList}>
			{files.map((f, i) => (
				<div key={i} className={styles.attachItem}>
					{f.preview ? (
						<img src={f.preview} alt={f.name} className={styles.attachThumb} />
					) : (
						<span className={styles.attachName}>{f.name}</span>
					)}
					{onRemove && (
						<button
							type='button'
							className={styles.attachRemove}
							onClick={() => onRemove(i)}
							aria-label='Удалить'
						>
							<IconX size={12} />
						</button>
					)}
				</div>
			))}
		</div>
	)
}

function TabChat() {
	const { pathname } = useLocation()
	const threadMatch = pathname.match(/^\/profile\/chat\/(\d+)/)
	const threadId = threadMatch ? threadMatch[1] : null
	const navigate = useNavigate()

	const [topics, setTopics] = useState([])
	const [currentTopic, setCurrentTopic] = useState(null)
	const [loading, setLoading] = useState(true)
	const [input, setInput] = useState('')
	const [sending, setSending] = useState(false)
	const [newTopicMode, setNewTopicMode] = useState(false)
	const [newTopicTitle, setNewTopicTitle] = useState('')
	const [newTopicMsg, setNewTopicMsg] = useState('')
	const [lightbox, setLightbox] = useState(null)
	const messagesEndRef = useRef(null)

	const msgAttach = useFileAttach()
	const topicAttach = useFileAttach()

	const loadTopics = useCallback(() => {
		getTopics()
			.then(res => {
				const data = res.data?.data?.data || res.data?.data || []
				setTopics(Array.isArray(data) ? data : [])
			})
			.catch(() => setTopics([]))
			.finally(() => setLoading(false))
	}, [])

	useEffect(() => {
		loadTopics()
	}, [loadTopics])

	useEffect(() => {
		if (!threadId) {
			setCurrentTopic(null)
			return
		}
		getTopic(threadId)
			.then(res => {
				const data = res.data?.data ?? res.data
				setCurrentTopic(data)
			})
			.catch(() => setCurrentTopic(null))
	}, [threadId])

	const scrollToBottom = () => {
		const el = messagesEndRef.current
		if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
	}

	useEffect(() => {
		if (currentTopic) scrollToBottom()
	}, [currentTopic?.messages?.length])

	const sendMsg = async () => {
		const hasText = input.trim()
		const hasFiles = msgAttach.files.length > 0
		if ((!hasText && !hasFiles) || !threadId) return
		setSending(true)
		try {
			const res = await addMessage(threadId, {
				content: input.trim(),
				attachments: msgAttach.getRawFiles(),
			})
			msgAttach.clearFiles()
			setInput('')
			const freshTopic = await getTopic(threadId)
			setCurrentTopic(freshTopic.data?.data ?? freshTopic.data)
		} catch {
			/* silent */
		} finally {
			setSending(false)
		}
	}

	const handleCreateTopic = async () => {
		if (!newTopicTitle.trim()) return
		setSending(true)
		try {
			await createTopic({
				title: newTopicTitle.trim(),
				content: newTopicMsg.trim() || newTopicTitle.trim(),
				attachments: topicAttach.getRawFiles(),
			})
			topicAttach.clearFiles()
			setNewTopicMode(false)
			setNewTopicTitle('')
			setNewTopicMsg('')
			loadTopics()
		} catch {
			/* silent */
		} finally {
			setSending(false)
		}
	}

	if (threadId && currentTopic) {
		const messages = currentTopic.messages || []
		return (
			<div className={styles.chatThread}>
				<Link
					to='/profile/chat'
					className={styles.chatBack}
					onClick={() => msgAttach.clearFiles()}
				>
					<svg
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path d='M15 18l-6-6 6-6' />
					</svg>
					Назад к темам
				</Link>
				<h3 className={styles.chatThreadTitle}>{currentTopic.title}</h3>
				<div className={styles.chatMessages} ref={messagesEndRef}>
					{messages.length === 0 && (
						<p className={styles.chatEmpty}>Напишите первое сообщение</p>
					)}
					{messages.map(msg => (
						<div
							key={msg.id}
							className={`${styles.chatMsg} ${msg.user?.is_admin ? styles.chatMsgAdmin : styles.chatMsgUser}`}
						>
							<div className={styles.chatBubble}>
								{msg.content && (
									<p className={styles.chatBubbleText}>{msg.content}</p>
								)}
								{msg.attachments?.length > 0 && (
									<div className={styles.chatBubbleFiles}>
										{msg.attachments.map((a, ai) =>
											a.mime_type?.startsWith('image/') ? (
												<img
													key={ai}
													src={a.url || a.thumbnail}
													alt={a.file_name}
													className={styles.chatBubbleImg}
													onClick={() => {
														const images = msg.attachments
															.filter(x => x.mime_type?.startsWith('image/'))
															.map(x => ({
																preview: x.url || x.thumbnail,
																name: x.file_name,
															}))
														setLightbox({
															images,
															startIndex: images.findIndex(
																x => x.name === a.file_name,
															),
														})
													}}
												/>
											) : (
												<a
													key={ai}
													className={styles.chatBubbleFile}
													href={a.url}
													target='_blank'
													rel='noopener noreferrer'
												>
													{a.file_name}
												</a>
											),
										)}
									</div>
								)}
								<span className={styles.chatBubbleTime}>
									{msg.created_at
										? new Date(msg.created_at).toLocaleString('ru-RU', {
												day: '2-digit',
												month: '2-digit',
												hour: '2-digit',
												minute: '2-digit',
											})
										: ''}
								</span>
							</div>
						</div>
					))}
				</div>
				<FilePreviewList
					files={msgAttach.files}
					onRemove={msgAttach.removeFile}
				/>
				<div className={styles.chatInput}>
					<button
						type='button'
						className={styles.chatAttachBtn}
						onClick={msgAttach.pickFiles}
						aria-label='Прикрепить файл'
						disabled={sending}
					>
						<IconPaperclip size={18} />
						{msgAttach.files.length > 0 && (
							<span className={styles.chatAttachCount}>
								{msgAttach.files.length}
							</span>
						)}
					</button>
					<input
						type='text'
						className={styles.chatInputField}
						placeholder='Введите сообщение...'
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && !sending && sendMsg()}
						disabled={sending}
					/>
					<button
						type='button'
						className={styles.chatSendBtn}
						onClick={sendMsg}
						disabled={
							sending || (!input.trim() && msgAttach.files.length === 0)
						}
					>
						<IconSend size={18} />
					</button>
				</div>
				{lightbox && (
					<Lightbox
						images={lightbox.images}
						startIndex={lightbox.startIndex}
						onClose={() => setLightbox(null)}
					/>
				)}
			</div>
		)
	}

	return (
		<div className={styles.chatTopics}>
			{newTopicMode ? (
				<div className={styles.chatNewTopic}>
					<input
						type='text'
						className={styles.chatNewTopicInput}
						placeholder='Тема обращения...'
						value={newTopicTitle}
						onChange={e => setNewTopicTitle(e.target.value)}
						autoFocus
						disabled={sending}
					/>
					<textarea
						className={styles.chatNewTopicTextarea}
						placeholder='Сообщение...'
						value={newTopicMsg}
						onChange={e => setNewTopicMsg(e.target.value)}
						rows={3}
						disabled={sending}
					/>
					<FilePreviewList
						files={topicAttach.files}
						onRemove={topicAttach.removeFile}
					/>
					<div className={styles.chatNewTopicActions}>
						<Button
							variant='primary'
							size='sm'
							onClick={handleCreateTopic}
							disabled={!newTopicTitle.trim() || sending}
						>
							{sending ? 'Создание...' : 'Создать тему'}
						</Button>
						<button
							type='button'
							className={styles.chatAttachBtn}
							onClick={topicAttach.pickFiles}
							aria-label='Прикрепить файл'
							disabled={sending}
						>
							<IconPaperclip size={16} />
							{topicAttach.files.length > 0 && (
								<span className={styles.chatAttachCount}>
									{topicAttach.files.length}
								</span>
							)}
						</button>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => {
								setNewTopicMode(false)
								setNewTopicTitle('')
								setNewTopicMsg('')
								topicAttach.clearFiles()
							}}
						>
							Отмена
						</Button>
					</div>
				</div>
			) : (
				<Button
					variant='primary'
					size='md'
					onClick={() => setNewTopicMode(true)}
				>
					Создать новую тему
				</Button>
			)}
			{loading && (
				<div className={styles.emptyTab}>
					<p className={styles.emptyTabTitle}>Загрузка...</p>
				</div>
			)}
			{!loading && topics.length === 0 && !newTopicMode && (
				<div
					className={styles.emptyTab}
					style={{ padding: 'var(--space-2xl) 0' }}
				>
					<IconChat size={48} strokeWidth={1} className={styles.emptyTabIcon} />
					<p className={styles.emptyTabTitle}>Нет обращений</p>
					<p className={styles.emptyTabText}>
						Создайте тему, чтобы связаться с нами
					</p>
				</div>
			)}
			<div className={styles.chatTopicList}>
				{topics.map(t => (
					<Link
						key={t.id}
						to={`/profile/chat/${t.id}`}
						className={styles.chatTopicBtn}
					>
						<span className={styles.chatTopicTitle}>{t.title}</span>
						<span className={styles.chatTopicMeta}>
							{t.created_at && (
								<span className={styles.chatTopicDate}>
									{new Date(t.created_at).toLocaleDateString('ru-RU')}
								</span>
							)}
							{t.unread_messages_count > 0 && (
								<span className={styles.chatTopicBadge}>
									{t.unread_messages_count}
								</span>
							)}
							<IconArrowRight size={14} className={styles.chatTopicArrow} />
						</span>
					</Link>
				))}
			</div>
		</div>
	)
}

/* ── TabPassword ── */
function TabPassword() {
	const { changePassword } = useAuth()
	const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		if (form.current.length < 8) {
			setError('Введите текущий пароль (минимум 8 символов)')
			return
		}
		if (form.newPass.length < 8) {
			setError('Новый пароль — минимум 8 символов')
			return
		}
		if (form.newPass !== form.confirm) {
			setError('Пароли не совпадают')
			return
		}
		setSaving(true)
		try {
			await changePassword({
				currentPassword: form.current,
				newPassword: form.newPass,
				newPasswordConfirmation: form.confirm,
			})
			setSaved(true)
			setForm({ current: '', newPass: '', confirm: '' })
			setTimeout(() => setSaved(false), 2500)
		} catch (err) {
			setError(getApiErrors(err))
		} finally {
			setSaving(false)
		}
	}

	return (
		<form className={styles.tabForm} onSubmit={handleSubmit}>
			{error && <p className={styles.formError}>{error}</p>}
			<div className={styles.field}>
				<label className={styles.fieldLabel}>Текущий пароль</label>
				<input
					type='password'
					value={form.current}
					onChange={e => {
						setForm(p => ({ ...p, current: e.target.value }))
						setError('')
					}}
					placeholder='Введите текущий пароль'
					disabled={saving}
				/>
			</div>
			<div className={styles.fieldRow2}>
				<div className={styles.field}>
					<label className={styles.fieldLabel}>Новый пароль</label>
					<input
						type='password'
						value={form.newPass}
						onChange={e => setForm(p => ({ ...p, newPass: e.target.value }))}
						placeholder='Минимум 8 символов'
						disabled={saving}
					/>
				</div>
				<div className={styles.field}>
					<label className={styles.fieldLabel}>Подтвердите пароль</label>
					<input
						type='password'
						value={form.confirm}
						onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
						placeholder='Ещё раз'
						disabled={saving}
					/>
				</div>
			</div>
			<div className={styles.formActions}>
				<Button type='submit' variant='primary' size='lg' disabled={saving}>
					{saved ? (
						<>
							<IconCheck size={18} /> Пароль изменён
						</>
					) : saving ? (
						'Сохранение...'
					) : (
						'Изменить пароль'
					)}
				</Button>
			</div>
		</form>
	)
}

/* ── ProfilePage ── */
export default function ProfilePage() {
	const {
		user,
		loading: authLoading,
		isAuthenticated,
		signOut,
		updateProfile,
	} = useAuth()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		if (!isAuthenticated) return
		const fetchUnread = () => {
			getUnreadCount()
				.then(res => setUnreadCount(res.data?.data?.unread_messages_count || 0))
				.catch(() => {})
		}
		fetchUnread()
		const interval = setInterval(fetchUnread, 10000)
		return () => clearInterval(interval)
	}, [isAuthenticated])

	if (authLoading) {
		return (
			<PageShell>
				<div
					style={{
						textAlign: 'center',
						padding: '6rem 0',
						color: 'var(--color-text-muted)',
					}}
				>
					Загрузка...
				</div>
			</PageShell>
		)
	}

	if (!isAuthenticated) return <Navigate to='/catalog' replace />

	const activeTab =
		[...TABS]
			.sort((a, b) => b.path.length - a.path.length)
			.find(t => pathname === t.path || pathname.startsWith(t.path + '/'))
			?.id || 'info'
	const currentTab = TABS.find(t => t.id === activeTab)

	const handleSignOut = async () => {
		await signOut()
		toast.info('Вы вышли из аккаунта')
		navigate('/')
	}

	const breadcrumbs = [{ label: 'Главная', to: '/' }]
	if (activeTab === 'info') {
		breadcrumbs.push({ label: 'Личный кабинет' })
	} else {
		breadcrumbs.push({ label: 'Личный кабинет', to: '/profile' })
		breadcrumbs.push({ label: currentTab.label })
	}

	const displayName =
		user.full_name ||
		[user.first_name, user.last_name].filter(Boolean).join(' ') ||
		'Пользователь'
	const avatarLetter = (
		user.first_name?.[0] ||
		user.email?.[0] ||
		'?'
	).toUpperCase()

	return (
		<PageShell>
			<Breadcrumbs items={breadcrumbs} />
			<div className={styles.header}>
				<div className={styles.avatar}>
					<span className={styles.avatarLetter}>{avatarLetter}</span>
					<div className={styles.avatarGlow} />
				</div>
				<div className={styles.headerInfo}>
					<h1 className={styles.headerName}>{displayName}</h1>
					<p className={styles.headerEmail}>
						<IconMail size={14} />
						{user.email}
					</p>
				</div>
			</div>
			<div className={styles.layout}>
				<nav className={styles.sidebar}>
					{TABS.map(tab => (
						<Link
							key={tab.id}
							to={tab.path}
							className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
						>
							{tab.icon ? (
								<tab.icon size={18} />
							) : (
								<svg
									width='18'
									height='18'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1.8'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<rect x='3' y='11' width='18' height='11' rx='2' />
									<path d='M7 11V7a5 5 0 0110 0v4' />
								</svg>
							)}
							<span>{tab.label}</span>
							{tab.id === 'chat' && unreadCount > 0 && activeTab !== 'chat' && (
								<span className={styles.tabBadge}>{unreadCount}</span>
							)}
							{activeTab === tab.id && <span className={styles.tabIndicator} />}
						</Link>
					))}
					<div className={styles.sidebarDivider} />
					<button className={styles.signOutBtn} onClick={handleSignOut}>
						Выйти из аккаунта
					</button>
				</nav>
				<div className={styles.content}>
					<div className={styles.contentCard}>
						{activeTab === 'info' && (
							<TabInfo user={user} updateProfile={updateProfile} />
						)}
						{activeTab === 'orders' && <TabOrders />}
						{activeTab === 'chat' && <TabChat />}
						{activeTab === 'password' && <TabPassword />}
					</div>
				</div>
			</div>
		</PageShell>
	)
}
