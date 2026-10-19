import { SparklesIcon } from '../Icons'
import styles from './HomeNotice.module.css'

export default function HomeNotice({ notice }) {
	const text = notice?.text?.trim()
	if (!text) return null

	return (
		<section className={styles.bar} aria-label='Объявление'>
			<div className={`container ${styles.inner}`}>
				<span className={styles.seal} aria-hidden='true'>
					<SparklesIcon size={22} />
				</span>
				<div className={styles.copy}>
					<p className={styles.kicker}>Объявление</p>
					<p className={styles.text}>{text}</p>
				</div>
			</div>
		</section>
	)
}
