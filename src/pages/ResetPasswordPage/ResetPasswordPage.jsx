import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../api/auth'
import { IconCheck } from '../../components/Icons'
import {
	Button,
	GlassCard,
	PageShell,
	PasswordInput,
} from '../../components/ui'
import styles from './ResetPasswordPage.module.css'

function getApiErrors(error) {
	if (error.response?.data?.errors) {
		return Object.values(error.response.data.errors).flat().join('. ')
	}
	return error.response?.data?.message || 'Произошла ошибка'
}

export default function ResetPasswordPage() {
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token') || ''
	const email = searchParams.get('email') || ''

	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [success, setSuccess] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		if (password.length < 8) {
			setError('Пароль должен быть не менее 8 символов')
			return
		}
		if (password !== passwordConfirm) {
			setError('Пароли не совпадают')
			return
		}

		setSubmitting(true)
		try {
			await resetPassword({
				email,
				token,
				password,
				passwordConfirmation: passwordConfirm,
			})
			setSuccess(true)
		} catch (err) {
			setError(getApiErrors(err))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<PageShell>
			<div className={styles.center}>
				<GlassCard maxWidth={440}>
					{success ? (
						<div className={styles.content}>
							<div className={styles.icon}>
								<IconCheck size={32} />
							</div>
							<h1 className={styles.title}>Пароль изменён</h1>
							<p className={styles.text}>
								Теперь вы можете войти с новым паролем.
							</p>
							<Button as={Link} to='/' variant='primary' size='lg'>
								На главную
							</Button>
						</div>
					) : (
						<div className={styles.content}>
							<h1 className={styles.title}>Новый пароль</h1>
							<p className={styles.text}>
								Введите новый пароль для аккаунта {email}
							</p>

							<form className={styles.form} onSubmit={handleSubmit} noValidate>
								{error && <p className={styles.error}>{error}</p>}
								<div className={styles.field}>
									<label className={styles.label}>Новый пароль</label>
									<PasswordInput
										value={password}
										onChange={e => setPassword(e.target.value)}
										placeholder='Минимум 8 символов'
										disabled={submitting}
										autoComplete='new-password'
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Подтвердите пароль</label>
									<PasswordInput
										value={passwordConfirm}
										onChange={e => setPasswordConfirm(e.target.value)}
										placeholder='Ещё раз'
										disabled={submitting}
										autoComplete='new-password'
									/>
								</div>
								<Button
									type='submit'
									variant='primary'
									size='lg'
									fullWidth
									disabled={submitting}
								>
									{submitting ? 'Сохранение...' : 'Сохранить пароль'}
								</Button>
							</form>
						</div>
					)}
				</GlassCard>
			</div>
		</PageShell>
	)
}
