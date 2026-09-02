import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { verifyRegistration } from '../../api/auth'
import { PageShell, Button, GlassCard } from '../../components/ui'
import { IconCheck } from '../../components/Icons'
import ResendVerification from '../../components/ResendVerification/ResendVerification'
import { useAuth } from '../../context/AuthContext'
import styles from './VerifyEmailPage.module.css'

export default function VerifyEmailPage() {
  const { user, hash } = useParams()
  const [searchParams] = useSearchParams()
  const { applySession } = useAuth()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const expires = searchParams.get('expires')
    const signature = searchParams.get('signature')
    let cancelled = false

    verifyRegistration(user, hash, { expires, signature })
      .then((res) => {
        if (cancelled) return
        const payload = res.data?.data
        if (payload?.token && payload?.user) {
          applySession(payload.token, payload.user)
          setLoggedIn(true)
        }
        setStatus('success')
        setMessage(res.data?.message || 'Email успешно подтверждён!')
      })
      .catch((err) => {
        if (cancelled) return
        setStatus('error')
        setMessage(
          err.response?.data?.message ||
            'Не удалось подтвердить email. Возможно, ссылка устарела.',
        )
      })

    return () => {
      cancelled = true
    }
  }, [user, hash, searchParams, applySession])

  return (
    <PageShell>
      <div className={styles.center}>
        <GlassCard maxWidth={480}>
          {status === 'loading' && (
            <div className={styles.content}>
              <p className={styles.text}>Подтверждаем ваш email...</p>
            </div>
          )}
          {status === 'success' && (
            <div className={styles.content}>
              <div className={styles.icon}>
                <IconCheck size={32} />
              </div>
              <h1 className={styles.title}>Email подтверждён</h1>
              <p className={styles.text}>{message}</p>
              <p className={styles.text}>
                {loggedIn
                  ? 'Вы вошли в аккаунт.'
                  : 'Теперь вы можете войти в свой аккаунт.'}
              </p>
              <Button as={Link} to={loggedIn ? '/profile' : '/'} variant="primary" size="lg">
                {loggedIn ? 'В личный кабинет' : 'На главную'}
              </Button>
            </div>
          )}
          {status === 'error' && (
            <div className={styles.content}>
              <h1 className={styles.title}>Ошибка подтверждения</h1>
              <p className={styles.text}>{message}</p>
              <ResendVerification
                allowEmailEdit
                hint="Введите email, указанный при регистрации, и мы отправим новое письмо."
              />
              <Button as={Link} to="/" variant="ghost" size="lg">
                На главную
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
    </PageShell>
  )
}
