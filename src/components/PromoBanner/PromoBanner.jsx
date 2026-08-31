import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeroMoonDecor, IconArrowRight, SparklesIcon } from '../Icons'
import { Button } from '../ui'
import styles from './PromoBanner.module.css'

function formatUntil(iso) {
	if (!iso) return null
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) return null

	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
		timeZone: 'Europe/Moscow',
	}).format(date)
}

function isInternalUrl(url) {
	return typeof url === 'string' && url.startsWith('/')
}

export default function PromoBanner({ promo }) {
	const [copied, setCopied] = useState(false)

	if (!promo?.title) return null

	const until = formatUntil(promo.ends_at)
	const hasSeal = Boolean(promo.discount_value)
	const hasButton = Boolean(promo.button_text && promo.button_url)
	const buttonIsInternal = isInternalUrl(promo.button_url)

	const copyCode = async () => {
		if (!promo.promo_code) return
		try {
			await navigator.clipboard.writeText(promo.promo_code)
			setCopied(true)
			window.setTimeout(() => setCopied(false), 1800)
		} catch {
			setCopied(false)
		}
	}

	return (
		<section className={styles.section} aria-label='Объявление о скидке'>
			<div className={styles.ornament} aria-hidden>
				<HeroMoonDecor className={styles.moon} />
			</div>

			<div
				className={`container ${styles.inner} ${hasSeal ? '' : styles.innerPlain}`}
			>
				{hasSeal && (
					<div className={styles.seal}>
						<span className={styles.sealValue}>{promo.discount_value}</span>
						{promo.discount_caption && (
							<span className={styles.sealCaption}>
								{promo.discount_caption}
							</span>
						)}
					</div>
				)}

				<div className={styles.body}>
					{promo.kicker && (
						<span className={styles.kicker}>
							<SparklesIcon size={16} />
							{promo.kicker}
						</span>
					)}

					<h2 className={styles.title}>{promo.title}</h2>

					{promo.subtitle && (
						<p className={styles.subtitle}>{promo.subtitle}</p>
					)}

					<div className={styles.meta}>
						{until && <span className={styles.until}>До {until}</span>}
						{promo.promo_code && (
							<button
								type='button'
								className={styles.code}
								onClick={copyCode}
								aria-label={`Скопировать промокод ${promo.promo_code}`}
							>
								<span className={styles.codeLabel}>
									{copied ? 'Скопировано' : 'Промокод'}
								</span>
								<span className={styles.codeValue}>{promo.promo_code}</span>
							</button>
						)}
						{hasButton && (
							<Button
								as={buttonIsInternal ? Link : 'a'}
								to={buttonIsInternal ? promo.button_url : undefined}
								href={buttonIsInternal ? undefined : promo.button_url}
								target={buttonIsInternal ? undefined : '_blank'}
								rel={buttonIsInternal ? undefined : 'noopener noreferrer'}
								variant='primary'
								size='lg'
								className={styles.cta}
							>
								{promo.button_text}
								<IconArrowRight size={18} />
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
