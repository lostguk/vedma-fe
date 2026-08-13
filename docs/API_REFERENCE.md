# API Reference — vedma-fe-new

Все API-вызовы к бэкенду `vedma-be` (Laravel 11).
Base URL: `VITE_API_URL` (обычно `http://localhost:8000/api/v1`).

---

## Аутентификация (api/auth.js)

### POST /login

Вход в аккаунт.

```javascript
authApi.login(email, password)
```

**Запрос:** `{ email, password }`
**Ответ:** `{ data: { token, user } }`
**Использование:** `AuthContext.signIn()` → сохраняет token в localStorage, user в state

### POST /register

Регистрация нового пользователя.

```javascript
authApi.register({
	firstName,
	lastName,
	middleName,
	email,
	password,
	passwordConfirmation,
	phone,
	address,
})
```

**Запрос:** `{ first_name, last_name, middle_name, email, password, password_confirmation, phone, address }`
**Ответ:** `{ data: { user } }` — без token (требуется email verification)
**Использование:** `AuthContext.register()`, `LoginModal` → режим регистрации, `CheckoutPage` (регистрация при заказе)

### POST /logout

Выход из аккаунта.

```javascript
authApi.logout()
```

**Использование:** `AuthContext.signOut()` → очистка token и user

### POST /forgot-password

Запрос ссылки для сброса пароля.

```javascript
authApi.forgotPassword(email)
```

**Запрос:** `{ email }`

### POST /reset-password

Установка нового пароля.

```javascript
authApi.resetPassword({ email, token, password, passwordConfirmation })
```

**Запрос:** `{ email, token, password, password_confirmation }`
**Использование:** `ResetPasswordPage`

### POST /change-password

Смена пароля (авторизованный пользователь).

```javascript
authApi.changePassword({
	currentPassword,
	newPassword,
	newPasswordConfirmation,
})
```

**Запрос:** `{ current_password, new_password, new_password_confirmation }`
**Использование:** `ProfilePage → TabPassword`

### GET /verify-registration/:user/:hash

Подтверждение email.

```javascript
authApi.verifyRegistration(userId, hash, { expires, signature })
```

**Использование:** `VerifyEmailPage`

### POST /verify-registration/resend

Повторная отправка письма верификации.

```javascript
authApi.resendVerification(email)
```

---

## Товары (api/products.js)

### GET /products

Список товаров с фильтрами.

```javascript
productsApi.getProducts({
	page: 1,
	per_page: 30,
	sort: 'created_at_desc', // price_asc, price_desc, name_asc
	category: 'slug',
	search: 'query',
	price_from: 100,
	price_to: 5000,
	ids: '1,2,3', // для избранного
	is_new: 1,
	is_bestseller: 1,
})
```

**Ответ:**

```json
{
  "data": [{ product... }],
  "meta": { "total": 42, "last_page": 2, "current_page": 1, "per_page": 30 }
}
```

**Использование:** `CatalogPage`, `FavoritesPage`, `HomePage` (через /home)

### GET /products/:slug

Детали товара по slug.

```javascript
productsApi.getProduct('svecha-ritualnaya')
```

**Ответ:** `{ data: { id, name, slug, price, old_price, stock, in_stock, images_urls, categories, related, breadcrumbs, description, ... } }` — поле `description` приходит как HTML из админки и на `ProductPage` рендерится через `dangerouslySetInnerHTML` (аналогично полю `text` у CMS-страниц в `StaticPage`).

**Использование:** `ProductPage`

---

## Категории (api/categories.js)

### GET /categories

Дерево категорий.

```javascript
categoriesApi.getCategories()
```

**Ответ:** `{ data: [{ id, name, slug, children: [...], exclude_from_shipping }] }`
**Использование:** `CatalogPage` (sidebar), `Header` (CatalogDropdown)

---

## Заказы (api/orders.js)

### POST /order/calculate

Расчёт стоимости заказа с промокодом.

```javascript
ordersApi.calculateOrder(
	[{ id: 1, count: 2 }],
	'PROMO10', // или null
)
```

**Ответ:** `{ data: { total_without_discount, total_with_discount, promo_code_status } }`
**promo_code_status:** `applied` | `not_exists` | `not_applied`
**Использование:** `usePromoCode`

### POST /order

Создание заказа.

```javascript
ordersApi.createOrder({
	items: [{ id: 1, count: 2 }],
	promo_code: 'PROMO10',
	register: false, // true для регистрации при заказе
	delivery_type: 'PostOffice', // стоимость доставки рассчитывается на сервере через MetaShip
	first_name: 'Анна',
	last_name: 'Иванова',
	middle_name: 'Сергеевна',
	email: 'anna@mail.ru',
	phone: '+7 (900) 123-45-67',
	address: 'г. Москва, ул. Ленина, д. 10',
	password: '12345678', // только если register: true
})
```

**Ответ:** `{ data: { id, status, ... } }`
**Использование:** `CheckoutPage`

### GET /orders

История заказов авторизованного пользователя.

```javascript
ordersApi.getOrders()
```

**Ответ:** `{ data: { data: [{ id, status, status_code, items, total_price, created_at, ... }] } }`
**Использование:** `ProfilePage → TabOrders`

---

## Платежи (api/payments.js)

### POST /payments

Создание платежа (Альфа-Банк).

```javascript
paymentsApi.createPayment({
	orderId: 42,
	successUrl: 'http://localhost:5175/payment-success?order_id=42',
	failUrl: 'http://localhost:5175/payment-error?order_id=42',
})
```

**Ответ:** `{ data: { payment_url: "https://alfa-bank.ru/pay/...", id: "uuid-public-id", ... } }`

При регистрации платежа в шлюзе бэкенд **дописывает** в `success_url` и `fail_url` query-параметр `payment=<public_id>`, чтобы на страницах возврата можно было вызвать проверку статуса.

**Использование:** `CheckoutPage`, `ProfilePage → TabOrders` (повторная оплата)

### GET /payments/:publicId/status

Проверка статуса платежа (запрос в банк и обновление записи в БД).

```javascript
paymentsApi.getPaymentStatus('uuid-public-id')
```

**Ответ:** `{ data: { id, order_id, status, amount, currency, payment_url, paid_at } }`

**Использование:** `OrderSuccessPage`, `OrderErrorPage` при наличии `?payment=...` в URL после редиректа с банка (короткий poll при статусах `pending` / `registered` / `created`).

### POST /payments/:publicId/refund

Возврат платежа (полный или частичный).

```javascript
paymentsApi.refundPayment('uuid-public-id', 1500)
```

**Запрос:** `{ amount: 1500 }` (необязательно — без amount = полный возврат)
**Ответ:** `{ data: { id, status: "refunded", ... } }`

---

## Профиль (api/profile.js)

### GET /profile

Данные авторизованного пользователя.

```javascript
profileApi.getProfile()
```

**Ответ:** `{ data: { id, email, first_name, last_name, middle_name, phone, address, full_name } }`
**Использование:** `AuthContext` (bootstrap при mount)

### PATCH /profile

Обновление данных профиля.

```javascript
profileApi.updateProfile({
	firstName,
	lastName,
	middleName,
	email,
	phone,
	address,
})
```

**Использование:** `ProfilePage → TabInfo`

---

## Доставка (api/shipping.js)

### POST /shipping/calculate

Расчёт стоимости доставки (Metaship).

```javascript
shippingApi.calculateShipping(
	[{ id: 1, quantity: 2 }],
	'г. Москва, ул. Ленина, д. 10',
)
```

**Ответ (Metaship):** `{ data: { PostOffice: [{ service: { total: "350.00" } }] } }`
**Парсинг:** `Math.round(parseFloat(data.PostOffice[0].service.total))`
**Использование:** `CheckoutPage`

---

## Главная страница (api/home.js)

### GET /home

Контент главной страницы.

```javascript
homeApi.getHomeContent()
```

**Ответ:** `{ data: { slides: [...], categories: [{ id, name, slug, products: [...] }] } }`
**Использование:** `HomePage`

---

## Чат поддержки (api/topics.js)

### GET /topics

Список тем обращений.

```javascript
topicsApi.getTopics()
```

### GET /topics/:id

Тема с сообщениями.

```javascript
topicsApi.getTopic(42)
```

**Ответ:** `{ data: { id, title, messages: [{ id, content, user, attachments, created_at }] } }`

### POST /topics

Создание новой темы (multipart/form-data).

```javascript
topicsApi.createTopic({
	title: 'Вопрос по заказу',
	content: 'Текст сообщения',
	attachments: [File, File],
})
```

### POST /topics/:id/messages

Отправка сообщения (multipart/form-data).

```javascript
topicsApi.addMessage(topicId, {
	content: 'Текст',
	attachments: [File],
})
```

### GET /topics/unread-count

Количество непрочитанных сообщений.

```javascript
topicsApi.getUnreadCount()
```

**Ответ:** `{ data: { unread_messages_count: 3 } }`
**Использование:** `ProfilePage` (badge в навигации, polling 10s)

---

## Статические страницы (api/pages.js)

### GET /pages

Список всех статических страниц.

```javascript
pagesApi.getPages()
```

**Ответ:** `{ data: [{ id, title, slug, is_visible_in_header, is_visible_in_footer }] }`

### GET /pages/:id

Контент статической страницы.

```javascript
pagesApi.getPage(3) // 3=delivery, 4=returns, 5=contacts
```

**Ответ:** `{ data: { id, title, slug, description, text, is_visible_in_header, is_visible_in_footer } }`
**Использование:** `StaticPage`

---

## DaData (api/dadata.js)

### POST /order/address/suggest

Подсказки адресов (проксируется через бэкенд).

```javascript
dadataApi.suggestAddress('Москва Ленина', 7)
```

**Запрос:** `{ query, count, language: 'ru' }`
**Ответ:** `{ data: { suggestions: [{ value, data: { street, house, city, ... } }] } }`
**Использование:** `AddressInput` компонент
