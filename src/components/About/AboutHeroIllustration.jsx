/**
 * Собственная иллюстрация для блока «О нас»: свечи, колба, травы — без внешних стоков.
 */
export default function AboutHeroIllustration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="about-hero-illustration-title"
    >
      <title id="about-hero-illustration-title">
        Ритуальные свечи, зелье в колбе и дикие травы — атмосфера ведьминой мастерской
      </title>
      <defs>
        <linearGradient id="about-hero-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-bg-alt, #F3EEF8)" />
          <stop offset="100%" stopColor="var(--color-bg-section, #EBE3F3)" />
        </linearGradient>
        <linearGradient id="about-hero-wax" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-white, #FFFFFF)" />
          <stop offset="100%" stopColor="var(--color-border, #D6CCE4)" />
        </linearGradient>
        <linearGradient id="about-hero-liquid" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="var(--color-primary-dark, #5D4580)" />
          <stop offset="100%" stopColor="var(--color-primary-light, #9E82C4)" />
        </linearGradient>
        <radialGradient id="about-hero-flame" cx="50%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="35%" stopColor="#F0B429" />
          <stop offset="70%" stopColor="#D97A1C" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D97A1C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="about-hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent, #B088C4)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-accent, #B088C4)" stopOpacity="0" />
        </radialGradient>
        <filter id="about-hero-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width="400" height="520" fill="url(#about-hero-sky)" />

      {/* Лунный диск */}
      <circle cx="320" cy="88" r="36" fill="var(--color-accent-light, #C8A6D8)" opacity="0.35" />
      <circle cx="308" cy="82" r="32" fill="url(#about-hero-sky)" opacity="0.9" />

      {/* Звёзды */}
      <g fill="var(--color-primary, #7B5EA7)" opacity="0.5">
        <path d="M48 64l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        <path d="M92 112l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
        <path d="M340 180l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
        <path d="M72 200l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
        <path d="M352 96l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </g>

      {/* Стол */}
      <path
        d="M0 420 L400 400 L400 520 L0 520 Z"
        fill="var(--color-primary-dark, #5D4580)"
        opacity="0.12"
      />
      <path
        d="M0 418 Q200 398 400 418 L400 430 Q200 410 0 430 Z"
        fill="var(--color-primary, #7B5EA7)"
        opacity="0.18"
      />

      {/* Травы сзади */}
      <g stroke="var(--color-primary-dark, #5D4580)" strokeWidth="1.2" fill="none" opacity="0.35">
        <path d="M52 380 Q48 320 70 280 M58 380 Q62 300 45 265" />
        <path d="M68 385 Q88 310 95 275 M75 388 Q100 330 115 295" />
        <path d="M300 382 Q310 310 295 270 M308 385 Q298 315 318 288" />
      </g>

      {/* Колба с зельем */}
      <g transform="translate(118, 248)">
        <ellipse cx="44" cy="118" rx="38" ry="10" fill="var(--color-primary-dark, #5D4580)" opacity="0.2" />
        <path
          d="M44 0 L58 0 L58 28 L72 42 Q82 88 82 108 Q82 128 44 128 Q6 128 6 108 Q6 88 16 42 L30 28 L30 0 Z"
          fill="url(#about-hero-liquid)"
          opacity="0.92"
        />
        <path
          d="M44 0 L58 0 L58 28 L72 42 Q82 88 82 108 Q82 128 44 128 Q6 128 6 108 Q6 88 16 42 L30 28 L30 0 Z"
          fill="none"
          stroke="var(--color-primary-dark, #5D4580)"
          strokeWidth="2"
          opacity="0.4"
        />
        {/* Поверхность жидкости */}
        <ellipse cx="44" cy="52" rx="22" ry="6" fill="var(--color-accent-light, #C8A6D8)" opacity="0.5" />
        <rect x="30" y="0" width="28" height="14" rx="3" fill="var(--color-secondary, #6B5A8E)" opacity="0.85" />
        <rect x="32" y="2" width="24" height="8" rx="2" fill="var(--color-border, #D6CCE4)" opacity="0.6" />
      </g>

      {/* Свеча высокая */}
      <g transform="translate(228, 198)">
        <ellipse cx="36" cy="178" rx="42" ry="12" fill="url(#about-hero-glow)" filter="url(#about-hero-blur)" opacity="0.8" />
        <rect x="18" y="68" width="36" height="112" rx="4" fill="url(#about-hero-wax)" />
        <ellipse cx="36" cy="68" rx="18" ry="6" fill="var(--color-white, #FFFFFF)" opacity="0.95" />
        <path d="M36 68 Q32 48 36 28 Q40 48 36 68" fill="url(#about-hero-flame)" />
        <ellipse cx="36" cy="32" rx="10" ry="14" fill="url(#about-hero-flame)" opacity="0.6" filter="url(#about-hero-blur)" />
      </g>

      {/* Свеча низкая */}
      <g transform="translate(48, 268)">
        <ellipse cx="32" cy="118" rx="36" ry="10" fill="url(#about-hero-glow)" filter="url(#about-hero-blur)" opacity="0.65" />
        <rect x="14" y="48" width="36" height="72" rx="4" fill="url(#about-hero-wax)" />
        <ellipse cx="32" cy="48" rx="18" ry="6" fill="var(--color-white, #FFFFFF)" opacity="0.95" />
        <path d="M32 48 Q28 34 32 18 Q36 34 32 48" fill="url(#about-hero-flame)" />
        <ellipse cx="32" cy="22" rx="8" ry="11" fill="url(#about-hero-flame)" opacity="0.55" filter="url(#about-hero-blur)" />
      </g>

      {/* Искры / частицы */}
      <g fill="var(--color-accent, #B088C4)" opacity="0.7">
        <circle cx="200" cy="160" r="2" />
        <circle cx="185" cy="190" r="1.5" />
        <circle cx="215" cy="175" r="1.5" />
        <circle cx="175" cy="220" r="1.2" />
        <circle cx="265" cy="150" r="1.8" />
      </g>
    </svg>
  )
}
