import { SparklesIcon, MoonIcon, LeafIcon } from '../Icons'
import styles from './Features.module.css'

const features = [
  {
    Icon: SparklesIcon,
    title: 'Авторские изделия',
    description: 'Каждое изделие создаётся вручную и заряжается особой энергией. Мы вкладываем намерение в каждую деталь.',
    image: 'https://blackcandle.ru/image/cache/catalog/svechi/zamena/Svecha–ritual«Ochischenieotporchi»-400x400.jpg',
  },
  {
    Icon: MoonIcon,
    title: 'Традиционные рецепты',
    description: 'Следуем древним знаниям и проверенным временем рецептурам. Каждое зелье — результат многовековой мудрости.',
    image: 'https://blackcandle.ru/image/cache/catalog/2026/maslo/dar-ostari/IMG_20250718_142528-400x400.jpg',
  },
  {
    Icon: LeafIcon,
    title: 'Натуральные материалы',
    description: 'Только природные компоненты: травы, воск, эфирные масла. Никакой синтетики — только сила природы.',
    image: 'https://blackcandle.ru/image/cache/catalog/svechi/travi/LuchiSolnca-400x400.jpg',
  },
]

export default function Features() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.bgPattern} />
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <span className={styles.label}>Почему выбирают нас</span>
          <h2 className={styles.title}>Сила в деталях</h2>
          <p className={styles.desc}>
            Наши свечи, зелья и артефакты созданы для тех, кто чувствует зов древних знаний
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
                  loading="lazy"
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
