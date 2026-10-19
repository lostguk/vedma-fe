import { useEffect, useRef, useState } from 'react'
import { addMessage, getTopic } from '../../api/topics'
import LinkedText from '../../components/LinkedText'
import { Button } from '../../components/ui'
import styles from './ProfilePage.module.css'

export default function OrderConversation({ topicId, onRead }) {
	const [topic, setTopic] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [text, setText] = useState('')
	const [sending, setSending] = useState(false)
	const onReadRef = useRef(onRead)
	const listRef = useRef(null)
	onReadRef.current = onRead

	useEffect(() => {
		let cancelled = false

		const load = () => {
			getTopic(topicId)
				.then(res => {
					if (cancelled) return
					setTopic(res.data?.data ?? res.data)
					setError('')
					onReadRef.current?.()
				})
				.catch(() => {
					if (!cancelled) setError('Не удалось открыть переписку')
				})
				.finally(() => {
					if (!cancelled) setLoading(false)
				})
		}

		load()
		const timer = setInterval(load, 15000)

		return () => {
			cancelled = true
			clearInterval(timer)
		}
	}, [topicId])

	useEffect(() => {
		const el = listRef.current
		if (el) el.scrollTop = el.scrollHeight
	}, [topic?.messages?.length])

	const send = async () => {
		const content = text.trim()
		if (!content || sending) return
		setSending(true)
		try {
			await addMessage(topicId, { content })
			setText('')
			const fresh = await getTopic(topicId)
			setTopic(fresh.data?.data ?? fresh.data)
			onReadRef.current?.()
		} catch {
			setError('Не удалось отправить сообщение')
		} finally {
			setSending(false)
		}
	}

	const messages = topic?.messages || []

	return (
		<section className={styles.orderChat}>
			<h3 className={styles.orderChatTitle}>Переписка по заказу</h3>
			<p className={styles.orderChatHint}>
				Здесь придёт трек отправления, ссылка на лекцию и ответы магазина.
				Ссылки в тексте можно нажать.
			</p>
			{loading && <p className={styles.chatEmpty}>Загрузка...</p>}
			{error && <p className={styles.orderChatError}>{error}</p>}
			{!loading && (
				<div className={styles.chatMessages} ref={listRef}>
					{messages.length === 0 && (
						<p className={styles.chatEmpty}>
							Сообщений пока нет. Когда заказ отправят, номер трека появится
							здесь.
						</p>
					)}
					{messages.map(msg => (
						<div
							key={msg.id}
							className={`${styles.chatMsg} ${msg.user?.is_admin ? styles.chatMsgAdmin : styles.chatMsgUser}`}
						>
							<div className={styles.chatBubble}>
								{msg.content && (
									<p className={styles.chatBubbleText}>
										<LinkedText text={msg.content} />
									</p>
								)}
								{msg.attachments?.length > 0 && (
									<div className={styles.chatBubbleFiles}>
										{msg.attachments.map(file =>
											file.mime_type?.startsWith('image/') ? (
												<a
													key={file.id || file.url}
													href={file.url}
													target='_blank'
													rel='noopener noreferrer'
												>
													<img
														src={file.url || file.thumbnail}
														alt={file.file_name || 'Вложение'}
														className={styles.chatBubbleImg}
													/>
												</a>
											) : (
												<a
													key={file.id || file.url}
													className={styles.chatBubbleFile}
													href={file.url}
													target='_blank'
													rel='noopener noreferrer'
												>
													{file.file_name || 'Файл'}
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
			)}
			<div className={styles.orderChatComposer}>
				<textarea
					className={styles.chatNewTopicTextarea}
					rows={3}
					placeholder='Написать по этому заказу...'
					value={text}
					disabled={sending}
					onChange={event => setText(event.target.value)}
					onKeyDown={event => {
						if (event.key === 'Enter' && !event.shiftKey) {
							event.preventDefault()
							send()
						}
					}}
				/>
				<Button
					variant='primary'
					size='sm'
					disabled={sending || !text.trim()}
					onClick={send}
				>
					{sending ? 'Отправляем...' : 'Отправить'}
				</Button>
			</div>
		</section>
	)
}
