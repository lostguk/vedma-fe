import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { verifyRegistration } from '../../api/auth'
import { PageShell, Button, GlassCard } from '../../components/ui'
import { IconCheck } from '../../components/Icons'
import styles from './VerifyEmailPage.module.css'

export default function VerifyEmailPage() {
  const { user, hash } = useParams()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const expires = searchParams.get('expires')
    const signature = searchParams.get('signature')

    verifyRegistration(user, hash, { expires, signature })
      .then((res) => {
        setStatus('success')
        setMessage(res.data?.message || 'Email успешно подтверждён!')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Не удалось подтвердить email. Возможно, ссылка устарела.')
      })
  }, [user, hash, searchParams])

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
              <p className={styles.text}>Теперь вы можете войти в свой аккаунт.</p>
              <Button as={Link} to="/" variant="primary" size="lg">
                На главную
              </Button>
            </div>
          )}
          {status === 'error' && (
            <div className={styles.content}>
              <h1 className={styles.title}>Ошибка подтверждения</h1>
              <p className={styles.text}>{message}</p>
              <Button as={Link} to="/" variant="primary" size="lg">
                На главную
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
    </PageShell>
  )
}
