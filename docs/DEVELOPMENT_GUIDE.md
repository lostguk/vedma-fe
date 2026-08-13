# Гайд по разработке vedma-fe-new

## Быстрый старт

```bash
cd vedma-fe-new
cp .env.example .env          # Скопировать .env (если есть example)
npm install                   # Установить зависимости
npm run dev                   # Запустить dev-сервер (port 5175)
```

Убедитесь, что бэкенд (`vedma-be`) запущен на `http://localhost:8000`.

---

## Как добавить новую страницу

### 1. Создать компонент страницы

```
src/pages/NewPage/
├── NewPage.jsx
└── NewPage.module.css
```

```jsx
import { PageShell, Breadcrumbs } from '../../components/ui'
import styles from './NewPage.module.css'

export default function NewPage() {
	return (
		<PageShell>
			<Breadcrumbs
				items={[{ label: 'Главная', to: '/' }, { label: 'Новая страница' }]}
			/>
			<h1 className={styles.title}>Новая страница</h1>
		</PageShell>
	)
}
```

### 2. Добавить маршрут в App.jsx

```jsx
import NewPage from './pages/NewPage/NewPage'

// Внутри <Routes>:
;<Route path='/new-page' element={<NewPage />} />
```

### 3. (Опционально) Добавить в навигацию

В `Header.jsx` → массив `navLinks`:

```javascript
{ label: 'Новая', to: '/new-page' }
```

---

## Как добавить новый API-эндпоинт

### 1. Добавить функцию в существующий модуль (или создать новый)

```javascript
// src/api/products.js
import apiClient from './client'

export function getProductReviews(slug) {
	return apiClient.get(`/products/${slug}/reviews`)
}
```

### 2. Если новый модуль — добавить в barrel-экспорт

```javascript
// src/api/index.js
export * as reviewsApi from './reviews'
```

### 3. Использовать в компоненте

```jsx
import { getProductReviews } from '../../api/products'

useEffect(() => {
	getProductReviews(slug)
		.then(res => {
			const reviews = res.data?.data ?? res.data
			setReviews(Array.isArray(reviews) ? reviews : [])
		})
		.catch(() => setReviews([]))
}, [slug])
```

---

## Как добавить новый UI-компонент

### 1. Создать компонент

```
src/components/ui/NewComponent/
├── NewComponent.jsx
└── NewComponent.module.css
```

### 2. Зарегистрировать в barrel-экспорте

```javascript
// src/components/ui/index.js
export { default as NewComponent } from './NewComponent/NewComponent'
```

### 3. Использовать

```jsx
import { NewComponent } from '../../components/ui'
```

---

## Как работать с формами

### Паттерн: useState + объект errors

```jsx
const [form, setForm] = useState({ name: '', email: '' })
const [errors, setErrors] = useState({})

const setField = (key, value) => {
	setForm(prev => ({ ...prev, [key]: value }))
	if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
}

const validate = () => {
	const e = {}
	if (!form.name.trim()) e.name = 'Обязательное поле'
	if (!form.email.trim()) e.email = 'Введите email'
	setErrors(e)
	return Object.keys(e).length === 0
}

const handleSubmit = async ev => {
	ev.preventDefault()
	if (!validate()) return
	try {
		await apiCall(form)
		toast.success('Сохранено')
	} catch (err) {
		toast.error(getApiErrors(err))
	}
}
```

### Обработка ошибок API

Стандартная функция (повторяется в нескольких файлах):

```javascript
function getApiErrors(error) {
	if (error.response?.data?.errors) {
		return Object.values(error.response.data.errors).flat().join('. ')
	}
	return error.response?.data?.message || 'Произошла ошибка'
}
```

---

## Как работать с маской телефона

Используем кастомную функцию `formatPhone`:

```javascript
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
```

Валидация: `form.phone.replace(/\D/g, '').length !== 11`

---

## Как работать с AddressInput (DaData)

```jsx
import { AddressInput } from '../../components/ui'

import {
  getAddressValidationError,
  isDeliverableAddress,
  ADDRESS_INCOMPLETE_MESSAGE,
} from '../../utils/address'

const [address, setAddress] = useState('')
const [addressData, setAddressData] = useState(null)
const [addressConfirmed, setAddressConfirmed] = useState(false)
const [addressError, setAddressError] = useState('')

const handleAddressChange = (text, dadataItem) => {
  setAddress(text)
  setAddressError('')
  if (dadataItem) {
    setAddressData(dadataItem)
    setAddressConfirmed(isDeliverableAddress(dadataItem))
    if (!isDeliverableAddress(dadataItem)) {
      setAddressError(ADDRESS_INCOMPLETE_MESSAGE)
    }
  } else {
    setAddressConfirmed(false)
    setAddressData(null)
  }
}

const handleAddressSelect = (dadataItem) => {
  setAddressData(dadataItem)
  if (isDeliverableAddress(dadataItem)) {
    setAddressConfirmed(true)
    setAddressError('')
  } else {
    setAddressConfirmed(false)
    setAddressError(ADDRESS_INCOMPLETE_MESSAGE)
  }
}

const addressErrorText = getAddressValidationError({
  address,
  addressConfirmed,
  addressData,
})

// JSX:
<AddressInput
  value={address}
  onChange={handleAddressChange}
  onSelect={handleAddressSelect}
  placeholder="Начните вводить адрес..."
  error={addressErrorText}
/>
```

---

## Как добавить данные в Context

### Пример: добавить метод в AuthContext

1. Создать API-функцию в `api/auth.js`:

```javascript
export function newAction(data) {
	return apiClient.post('/new-action', data)
}
```

2. Добавить метод в `AuthContext.jsx`:

```javascript
const newAction = useCallback(async data => {
	const res = await authApi.newAction(data)
	return res.data
}, [])
```

3. Добавить в `value` useMemo и deps:

```javascript
const value = useMemo(
	() => ({ ...existing, newAction }),
	[...existingDeps, newAction],
)
```

---

## Как работать с товарами

### Структура объекта товара из API

```javascript
{
  id: 1,
  name: "Свеча ритуальная",
  slug: "svecha-ritualnaya",
  description: "Описание...",
  price: 450,
  old_price: 600,            // null если нет скидки
  stock: 25,                 // null = неограниченно, 0 = нет в наличии
  in_stock: true,            // boolean
  is_new: false,
  is_bestseller: true,
  image_url: "http://...",   // основное изображение
  thumb_url: "http://...",   // миниатюра
  images_urls: ["..."],      // галерея
  categories: [{ id, name, slug }],
  related: [{ ... }],        // похожие товары
  breadcrumbs: [{ type, name, slug }]
}
```

### Добавление в корзину

```javascript
const { addToCart } = useCart()

// Передаём полный объект товара (не только id!)
addToCart(product, 1)

// addToCart проверяет in_stock — не добавит товар без наличия
```

### Проверка наличия

```jsx
const inStock = product.in_stock !== false

{
	inStock ? (
		<button onClick={() => addToCart(product)}>Купить</button>
	) : (
		<span>Нет в наличии</span>
	)
}
```

---

## Как работать с промокодами

Хук `usePromoCode` в `CheckoutPage/usePromoCode.js`:

```jsx
const promo = usePromoCode(items) // items из CartContext

// Свойства:
promo.promoInput // строка ввода
promo.setPromoInput // сеттер
promo.promoApplied // { code, description } | null
promo.promoApplying // boolean (загрузка)
promo.promoError // строка ошибки
promo.applyPromo() // применить промокод
promo.removePromo() // убрать промокод
promo.calcResult // результат POST /order/calculate
```

Статусы от бэкенда: `applied`, `not_exists`, `not_applied`.

---

## Как работать со статусами заказов

```javascript
const STATUS_MAP = {
	new: { label: 'Новый' },
	payment_pending: { label: 'Ожидает оплату' },
	paid: { label: 'Оплачен' },
	payment_failed: { label: 'Ошибка оплаты' },
	refunded: { label: 'Возврат' },
	cancelled: { label: 'Отменён' },
}

const PAYABLE_STATUSES = ['new', 'payment_pending', 'payment_failed']
const REPEATABLE_STATUSES = ['paid', 'refunded', 'cancelled']
```

---

## Чеклист при разработке

### Перед началом

- [ ] Проверить, существует ли нужный API-эндпоинт на бэкенде
- [ ] Изучить формат ответа API (curl / Network tab)
- [ ] Сверить валидацию фронта с `vedma-be/app/Http/Requests/Api/V1/`

### Во время разработки

- [ ] camelCase на фронте → snake_case на бэке (трансформация в api/)
- [ ] Парсинг ответа: `res.data?.data ?? res.data`
- [ ] Обработка ошибок: `getApiErrors(error)` или `toast.error()`
- [ ] Цены: `toLocaleString('ru-RU')` + ` ₽`
- [ ] Все тексты UI на русском
- [ ] Loading-состояния (skeletons или текст)
- [ ] Empty-состояния (EmptyState компонент)

### После разработки

- [ ] Проверить на мобильном разрешении
- [ ] Проверить с разными темами
- [ ] Проверить с пустыми данными (no products, no orders)
- [ ] Проверить обработку 401 (протухший токен)
- [ ] Проверить обработку 422 (ошибки валидации)

---

## Частые ошибки и решения

### «Данные не отображаются после загрузки из API»

**Причина:** неправильный парсинг ответа API.
**Решение:** проверить реальный формат через `curl` или Network tab. Использовать `res.data?.data ?? res.data`.

### «Элементы не анимируются через .reveal»

**Причина:** элементы добавлены в DOM после mount (данные из API).
**Решение:** `useScrollReveal` использует MutationObserver — убедитесь, что элемент находится внутри `ref` от хука.

### «Товар добавляется в корзину, но без данных (имя, цена)»

**Причина:** в `addToCart` передан только id вместо полного объекта.
**Решение:** `addToCart(product, qty)` — всегда передавать полный объект товара.

### «Маска телефона не работает / валидация не проходит»

**Причина:** проверяется длина отформатированной строки, а не цифр.
**Решение:** `form.phone.replace(/\D/g, '').length !== 11` — считаем только цифры.

### «DaData подсказки не появляются»

**Причина:** endpoint `/order/address/suggest` проксирует через бэкенд. Бэкенд должен быть запущен.
**Решение:** проверить, что бэкенд работает и DADATA_TOKEN настроен в `.env` бэкенда.

### «После создания заказа перекидывает в каталог»

**Причина:** `clearCart()` вызван до redirect на оплату, корзина пуста → useEffect в CheckoutPage делает navigate('/catalog').
**Решение:** `clearCart()` вызывается **только** на `OrderSuccessPage`, не при создании заказа.

### «Мерцание при переходе между страницами»

**Причина:** PageTransition рендерит одновременно старую и новую страницу.
**Решение:** используется `key={pathname}` для force remount + чистая CSS @keyframes анимация.
