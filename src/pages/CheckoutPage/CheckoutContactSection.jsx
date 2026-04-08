import { Link } from 'react-router-dom'
import { IconUser } from '../../components/Icons'
import styles from './CheckoutPage.module.css'

function formatPhone(raw) {
  let v = raw.replace(/[^\d+() -]/g, '')
  if (v && !v.startsWith('+7')) {
    const digits = v.replace(/\D/g, '')
    if (digits.startsWith('8')) v = '+7' + digits.slice(1)
    else if (digits.startsWith('7')) v = '+' + digits
    else v = '+7' + digits
  }
  const digits = v.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 1) return digits.length ? '+7' : ''
  let f = '+7'
  if (digits.length > 1) f += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) f += ') '
  if (digits.length > 4) f += digits.slice(4, 7)
  if (digits.length > 7) f += '-' + digits.slice(7, 9)
  if (digits.length > 9) f += '-' + digits.slice(9, 11)
  return f
}

export default function CheckoutContactSection({ form, errors, setField, isAuthenticated, user, signOut, onLoginOpen, consent, onConsentChange }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitleRow}>
          <IconUser size={22} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Покупатель</h2>
        </div>
        {!isAuthenticated && (
          <button type="button" className={styles.linkBtn} onClick={onLoginOpen}>
            Есть аккаунт? Войти
          </button>
        )}
      </div>

      {isAuthenticated && (
        <div className={styles.loggedBanner}>
          <div>
            <p className={styles.loggedText}>
              Вы вошли как <strong>{user.email}</strong>
            </p>
            {(user.last_name || user.first_name) && (
              <p className={styles.loggedSub}>
                {[user.last_name, user.first_name, user.middle_name].filter(Boolean).join(' ')}
              </p>
            )}
          </div>
          <button type="button" className={styles.signOutBtn} onClick={() => signOut()}>
            Выйти
          </button>
        </div>
      )}

      {!isAuthenticated && (
        <>
          <p className={styles.sectionHint}>
            Войдите или заполните поля ниже — мы создадим аккаунт при оформлении заказа.
          </p>
          <div className={styles.fieldGrid3}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="co-lastname">Фамилия *</label>
              <input id="co-lastname" className={errors.lastName ? styles.inputError : undefined} value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} autoComplete="family-name" />
              {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="co-firstname">Имя *</label>
              <input id="co-firstname" className={errors.firstName ? styles.inputError : undefined} value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} autoComplete="given-name" />
              {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="co-middlename">Отчество</label>
              <input id="co-middlename" value={form.middleName} onChange={(e) => setField('middleName', e.target.value)} autoComplete="additional-name" />
            </div>
          </div>
        </>
      )}

      <div className={styles.fieldGrid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="co-phone">Телефон *</label>
          {isAuthenticated && user.phone ? (
            <div className={styles.readonlyBox}>{user.phone}</div>
          ) : (
            <>
              <input
                id="co-phone"
                type="tel"
                className={errors.phone ? styles.inputError : undefined}
                placeholder="+7 (900) 123-45-67"
                value={form.phone}
                onChange={(e) => setField('phone', formatPhone(e.target.value))}
                autoComplete="tel"
              />
              {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
            </>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="co-email">Email *</label>
          {isAuthenticated ? (
            <div className={styles.readonlyBox}>{user.email}</div>
          ) : (
            <>
              <input id="co-email" type="email" className={errors.email ? styles.inputError : undefined} value={form.email} onChange={(e) => setField('email', e.target.value)} autoComplete="email" />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className={styles.fieldGrid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="co-pass">Пароль *</label>
            <input id="co-pass" type="password" className={errors.password ? styles.inputError : undefined} value={form.password} onChange={(e) => setField('password', e.target.value)} autoComplete="new-password" placeholder="Минимум 8 символов" />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="co-pass2">Подтвердите пароль *</label>
            <input id="co-pass2" type="password" className={errors.passwordConfirm ? styles.inputError : undefined} value={form.passwordConfirm} onChange={(e) => setField('passwordConfirm', e.target.value)} autoComplete="new-password" />
            {errors.passwordConfirm && <span className={styles.fieldError}>{errors.passwordConfirm}</span>}
          </div>
        </div>
      )}

      <label className={styles.consent}>
        <input type="checkbox" checked={consent} onChange={(e) => onConsentChange(e.target.checked)} className={styles.consentCheck} />
        <span className={styles.consentText}>
          Я соглашаюсь с{' '}
          <Link to="/privacy" className={styles.consentLink}>Политикой конфиденциальности</Link>,{' '}
          <Link to="/offer" className={styles.consentLink}>Публичной офертой</Link>{' '}
          и даю согласие на обработку персональных данных
        </span>
      </label>
      {errors.consent && <span className={styles.fieldError}>{errors.consent}</span>}
    </section>
  )
}
