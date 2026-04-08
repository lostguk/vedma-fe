import { Link } from 'react-router-dom'
import { FloatingParticles, IconStar, IconHeart, IconArrowRight } from '../Icons'
import { Button } from '../ui'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.bgDecor}>
        <div className={styles.circle} />
        <FloatingParticles className={styles.particles} />
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.imageCol}>
          <div className={styles.imageWrap}>
            <img
              src="/images/about-main.png"
              alt="Мастер создаёт ритуальную свечу с травами в уютной мастерской"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.imageFrame} />
          </div>
          <div className={styles.imageAccent}>
            <img
              src="/images/about-small.png"
              alt="Эфирное масло, шалфей, аметист и лаванда"
              className={styles.imageSmall}
              loading="lazy"
            />
          </div>
        </div>

        <div className={styles.content}>
          <span className={styles.label}>О нас</span>
          <h2 className={styles.title}>
            Каждое изделие — это <span className={styles.accent}>энергия, сила и тайна</span>,
            воплощённые в материальном мире
          </h2>
          <p className={styles.text}>
            Наши свечи, зелья и артефакты созданы для тех, кто чувствует зов древних знаний.
            Мы бережно храним традиции и создаём каждое изделие с глубоким уважением
            к силам природы и многовековой мудрости.
          </p>
          <p className={styles.text}>
            Выбирайте осознанно. Действуйте смело. Позвольте магии стать частью
            вашей повседневной жизни.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <IconStar size={20} />
              </div>
              <div>
                <strong>Качество и подлинность</strong>
                <p>Только проверенные временем рецепты</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <IconHeart size={20} />
              </div>
              <div>
                <strong>Забота и внимание</strong>
                <p>Индивидуальный подход к каждому заказу</p>
              </div>
            </div>
          </div>

          <Button as={Link} to="/catalog" variant="primary" size="xl">
            Перейти в каталог <IconArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  )
}
