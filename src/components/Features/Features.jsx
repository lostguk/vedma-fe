import { LeafIcon, MoonIcon, SparklesIcon } from '../Icons'
import styles from './Features.module.css'

const features = [
	{
		Icon: SparklesIcon,
		title: 'Авторские изделия',
		description:
			'Каждое изделие создаётся вручную и заряжается особой энергией. Мы вкладываем намерение в каждую деталь.',
		image: '/images/features/feature-handmade.jpg',
	},
	{
		Icon: MoonIcon,
		title: 'Традиционные рецепты',
		description:
			'Следуем древним знаниям и проверенным временем рецептурам. Каждое зелье — результат многовековой мудрости.',
		image: '/images/features/feature-traditions.jpg',
	},
	{
		Icon: LeafIcon,
		title: 'Натуральные материалы',
		description:
			'Только природные компоненты: травы, воск, эфирные масла. Никакой синтетики — только сила природы.',
		image: '/images/features/feature-natural.jpg',
	},
]

export default function Features() {
	return (
		<section className={styles.section} id='features'>
			<div className={styles.bgPattern} />
			<div className={`container ${styles.container}`}>
				<div className={styles.header}>
					<span className={styles.label}>Почему выбирают нас</span>
					<h2 className={styles.title}>Сила в деталях</h2>
					<p className={styles.desc}>
						Наши свечи, зелья и артефакты созданы для тех, кто чувствует зов
						древних знаний
					</p>
				</div>

				<div className={styles.grid}>
					{features.map((feature, i) => (
						<article key={i} className={styles.card}>
							<div className={styles.cardImageWrap}>
								<img
									src={feature.image}
									alt={feature.title}
									className={styles.cardImage}
									loading='lazy'
								/>
								<div className={styles.cardImageOverlay} />
							</div>
							<div className={styles.cardContent}>
								<div className={styles.cardIcon}>
									<feature.Icon size={28} />
								</div>
								<h3 className={styles.cardTitle}>{feature.title}</h3>
								<p className={styles.cardDesc}>{feature.description}</p>
							</div>
							<div className={styles.cardLine} />
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
