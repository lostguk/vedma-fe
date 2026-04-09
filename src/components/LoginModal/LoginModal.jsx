import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import Modal from '../Modal/Modal'
import { Button, PasswordInput } from '../ui'
import styles from './LoginModal.module.css'

const VIEW_LOGIN = 'login'
const VIEW_REGISTER = 'register'
const VIEW_FORGOT = 'forgot'

const TITLES = {
	[VIEW_LOGIN]: 'Вход',
	[VIEW_REGISTER]: 'Регистрация',
	[VIEW_FORGOT]: 'Восстановление пароля',
}

function getApiErrors(error) {
	if (error.response?.data?.errors) {
		const msgs = Object.values(error.response.data.errors).flat()
		return msgs.join('. ')
	}
	if (error.response?.data?.message) {
		return error.response.data.message
	}
	return 'Произошла ошибка. Попробуйте позже.'
}

export default function LoginModal({ open, onClose, onAuthSuccess }) {
	const { signIn, register: registerUser, forgotPassword } = useAuth()
	const [view, setView] = useState(VIEW_LOGIN)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [middleName, setMiddleName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [formError, setFormError] = useState('')
	const [consent, setConsent] = useState(false)
	const [resetSent, setResetSent] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [registerSuccess, setRegisterSuccess] = useState(false)

	useEffect(() => {
		if (!open) {
			setFormError('')
			setPassword('')
			setPassword2('')
			setResetSent(false)
			setSubmitting(false)
			setRegisterSuccess(false)
		}
	}, [open])

	const switchView = v => {
		setView(v)
		setFormError('')
		setResetSent(false)
		setRegisterSuccess(false)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setFormError('')
		const em = email.trim().toLowerCase()

		if (view === VIEW_FORGOT) {
			if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
				setFormError('Введите корректный email')
				return
			}
			setSubmitting(true)
			try {
				await forgotPassword(em)
				setResetSent(true)
			} catch (err) {
				setFormError(getApiErrors(err))
			} finally {
				setSubmitting(false)
			}
			return
		}

		if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
			setFormError('Введите корректный email')
			return
		}
		if (password.length < 8) {
			setFormError('Пароль не короче 8 символов')
			return
		}

		if (view === VIEW_REGISTER) {
			if (!firstName.trim()) {
				setFormError('Укажите имя')
				return
			}
			if (!lastName.trim()) {
				setFormError('Укажите фамилию')
				return
			}
			if (!middleName.trim()) {
				setFormError('Укажите отчество')
				return
			}
			if (password !== password2) {
				setFormError('Пароли не совпадают')
				return
			}
			if (!consent) {
				setFormError('Необходимо согласие на обработку персональных данных')
				return
			}
			setSubmitting(true)
			try {
				await registerUser({
					email: em,
					firstName: firstName.trim(),
					lastName: lastName.trim(),
					middleName: middleName.trim(),
					password,
					passwordConfirmation: password2,
				})
				setRegisterSuccess(true)
			} catch (err) {
				setFormError(getApiErrors(err))
			} finally {
				setSubmitting(false)
			}
		} else {
			setSubmitting(true)
			try {
				const result = await signIn(em, password)
				const name = result?.data?.user?.first_name || ''
				toast.success(
					name ? `С возвращением, ${name}!` : 'Вы успешно вошли в аккаунт',
				)
				onAuthSuccess?.()
				onClose()
			} catch (err) {
				if (err.response?.status === 403) {
					setFormError('Email не подтверждён. Проверьте почту.')
				} else if (err.response?.status === 422) {
					setFormError('Неверный email или пароль')
				} else {
					setFormError(getApiErrors(err))
				}
			} finally {
				setSubmitting(false)
			}
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={TITLES[view]} size='sm'>
			<form className={styles.form} onSubmit={handleSubmit} noValidate>
				{formError && (
					<p className={styles.formError} role='alert'>
						{formError}
					</p>
				)}

				{/* Registration success */}
				{view === VIEW_REGISTER && registerSuccess && (
					<div className={styles.resetSuccess}>
						<div className={styles.resetSuccessIcon}>
							<svg
								width='32'
								height='32'
								viewBox='0 0 24 24'
								fill='none'
								stroke='var(--color-primary)'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M22 11.08V12a10 10 0 11-5.93-9.14' />
								<path d='M22 4L12 14.01l-3-3' />
							</svg>
						</div>
						<p className={styles.resetSuccessTitle}>Регистрация успешна</p>
						<p className={styles.resetSuccessText}>
							На <strong>{email.trim().toLowerCase()}</strong> отправлено письмо
							для подтверждения. Проверьте почту и папку «Спам».
						</p>
						<Button
							type='button'
							variant='primary'
							size='lg'
							fullWidth
							onClick={() => switchView(VIEW_LOGIN)}
						>
							Перейти ко входу
						</Button>
					</div>
				)}

				{/* Forgot: success state */}
				{view === VIEW_FORGOT && resetSent && (
					<div className={styles.resetSuccess}>
						<div className={styles.resetSuccessIcon}>
							<svg
								width='32'
								height='32'
								viewBox='0 0 24 24'
								fill='none'
								stroke='var(--color-primary)'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M22 11.08V12a10 10 0 11-5.93-9.14' />
								<path d='M22 4L12 14.01l-3-3' />
							</svg>
						</div>
						<p className={styles.resetSuccessTitle}>Письмо отправлено</p>
						<p className={styles.resetSuccessText}>
							Инструкция по восстановлению пароля отправлена на{' '}
							<strong>{email.trim().toLowerCase()}</strong>. Проверьте почту и
							папку «Спам».
						</p>
						<Button
							type='button'
							variant='primary'
							size='lg'
							fullWidth
							onClick={() => switchView(VIEW_LOGIN)}
						>
							Вернуться ко входу
						</Button>
					</div>
				)}

				{/* Forgot: form */}
				{view === VIEW_FORGOT && !resetSent && (
					<>
						<p className={styles.forgotHint}>
							Введите email, указанный при регистрации. Мы отправим вам ссылку
							для сброса пароля.
						</p>
						<div className={styles.field}>
							<label className={styles.label} htmlFor='forgot-email'>
								Email
							</label>
							<input
								id='forgot-email'
								type='email'
								placeholder='example@mail.ru'
								value={email}
								onChange={e => setEmail(e.target.value)}
								autoComplete='email'
								disabled={submitting}
							/>
						</div>
						<Button
							type='submit'
							variant='primary'
							size='lg'
							fullWidth
							disabled={submitting}
						>
							{submitting ? 'Отправка...' : 'Отправить ссылку'}
						</Button>
						<button
							type='button'
							className={styles.switchBtn}
							onClick={() => switchView(VIEW_LOGIN)}
						>
							Вернуться ко входу
						</button>
					</>
				)}

				{/* Login / Register */}
				{view !== VIEW_FORGOT &&
					!(view === VIEW_REGISTER && registerSuccess) && (
						<>
							{view === VIEW_REGISTER && (
								<>
									<div className={styles.field}>
										<label className={styles.label} htmlFor='login-firstname'>
											Имя
										</label>
										<input
											id='login-firstname'
											type='text'
											placeholder='Ваше имя'
											value={firstName}
											onChange={e => setFirstName(e.target.value)}
											autoComplete='given-name'
											disabled={submitting}
										/>
									</div>
									<div className={styles.field}>
										<label className={styles.label} htmlFor='login-lastname'>
											Фамилия
										</label>
										<input
											id='login-lastname'
											type='text'
											placeholder='Ваша фамилия'
											value={lastName}
											onChange={e => setLastName(e.target.value)}
											autoComplete='family-name'
											disabled={submitting}
										/>
									</div>
									<div className={styles.field}>
										<label className={styles.label} htmlFor='login-middlename'>
											Отчество
										</label>
										<input
											id='login-middlename'
											type='text'
											placeholder='Ваше отчество'
											value={middleName}
											onChange={e => setMiddleName(e.target.value)}
											autoComplete='additional-name'
											disabled={submitting}
										/>
									</div>
								</>
							)}

							<div className={styles.field}>
								<label className={styles.label} htmlFor='login-email'>
									Email
								</label>
								<input
									id='login-email'
									type='email'
									placeholder='example@mail.ru'
									value={email}
									onChange={e => setEmail(e.target.value)}
									autoComplete='email'
									disabled={submitting}
								/>
							</div>

							<div className={styles.field}>
								<label className={styles.label} htmlFor='login-password'>
									Пароль
								</label>
								<PasswordInput
									id='login-password'
									placeholder='Минимум 8 символов'
									value={password}
									onChange={e => setPassword(e.target.value)}
									autoComplete={
										view === VIEW_REGISTER ? 'new-password' : 'current-password'
									}
									disabled={submitting}
								/>
							</div>

							{view === VIEW_REGISTER && (
								<div className={styles.field}>
									<label className={styles.label} htmlFor='login-password2'>
										Повторите пароль
									</label>
									<PasswordInput
										id='login-password2'
										placeholder='Ещё раз'
										value={password2}
										onChange={e => setPassword2(e.target.value)}
										autoComplete='new-password'
										disabled={submitting}
									/>
								</div>
							)}

							{view === VIEW_REGISTER && (
								<label className={styles.consent}>
									<input
										type='checkbox'
										checked={consent}
										onChange={e => setConsent(e.target.checked)}
										className={styles.consentCheck}
										disabled={submitting}
									/>
									<span className={styles.consentText}>
										Я соглашаюсь с{' '}
										<Link
											to='/privacy'
											className={styles.consentLink}
											onClick={onClose}
										>
											Политикой конфиденциальности
										</Link>{' '}
										и даю согласие на обработку персональных данных
									</span>
								</label>
							)}

							<Button
								type='submit'
								variant='primary'
								size='lg'
								fullWidth
								disabled={submitting}
							>
								{submitting
									? 'Загрузка...'
									: view === VIEW_REGISTER
										? 'Создать аккаунт'
										: 'Войти'}
							</Button>

							{view === VIEW_LOGIN && (
								<button
									type='button'
									className={styles.forgotBtn}
									onClick={() => switchView(VIEW_FORGOT)}
								>
									Забыли пароль?
								</button>
							)}

							<div className={styles.divider}>
								<span>или</span>
							</div>

							<button
								type='button'
								className={styles.switchBtn}
								onClick={() =>
									switchView(
										view === VIEW_REGISTER ? VIEW_LOGIN : VIEW_REGISTER,
									)
								}
							>
								{view === VIEW_REGISTER
									? 'Уже есть аккаунт? Войти'
									: 'Нет аккаунта? Зарегистрироваться'}
							</button>
						</>
					)}
			</form>
		</Modal>
	)
}
