# План миграции vedma-fe → vedma-fe-new

## Цель

Перенести всю бизнес-логику из старого фронтенда (vedma-fe) в новый (vedma-fe-new) с интеграцией реального бэкенда (vedma-be). Сохраняем подход нового фронтенда: React Context, CSS Modules, чистый JSX.

## Принципы

- **Стейт:** React Context (не Redux)
- **Стили:** CSS Modules (не Emotion/styled-components)
- **API-слой:** Отдельная прослойка `src/api/` с описанием всех запросов
- **Auth:** JWT Bearer token + localStorage (Sanctum)
- **Избранное:** localStorage (без API, как есть)
- **Темы:** localStorage + CSS-переменные (как есть)

---

## Блок 1: Инфраструктура (API-слой + Auth)

### 1.1 Env-файлы
- Создать `.env` с `VITE_API_URL=http://localhost:8000/api/v1` и `VITE_DADATA_TOKEN`
- Создать `.env.production` с production URL
- Добавить `.env` в `.gitignore`

### 1.2 Установить зависимости
- `axios` — HTTP-клиент

### 1.3 API-клиент (`src/api/client.js`)
- Axios singleton с `baseURL` из `VITE_API_URL`
- Request interceptor: Bearer token из localStorage
- Response interceptor: при 401 → очистка токена
- Хелперы: `setToken`, `getToken`, `removeToken`
- Ключ хранения: `vedmino-token`

### 1.4 API-эндпоинты (файлы в `src/api/`)
- `auth.js` — login, register, logout, forgot-password, reset-password, change-password, verify-registration, resend-verification
- `products.js` — index (с фильтрами/пагинацией), show (по slug)
- `categories.js` — index, show (по slug)
- `orders.js` — calculate, store, index (история)
- `payments.js` — store, status, refund
- `pages.js` — index, show (по id)
- `topics.js` — index, store, show, addMessage, unreadCount
- `shipping.js` — calculate
- `profile.js` — show, update
- `home.js` — show (контент главной)
- `dadata.js` — addressSuggest

### 1.5 AuthContext — переписать на реальный API
- `signIn(email, password)` → `POST /login` → сохранить token + user
- `register(data)` → `POST /register` → сохранить user (без токена, email verification)
- `signOut()` → `POST /logout` → очистить token + user
- `forgotPassword(email)` → `POST /forgot-password`
- `resetPassword(data)` → `POST /reset-password`
- `changePassword(data)` → `POST /change-password`
- `updateProfile(data)` → `PATCH /profile`
- Bootstrap: при наличии токена → `GET /profile` → setUser
- Хранение: token в localStorage, user в state (гидратация при mount)

### 1.6 LoginModal — подключить к реальному API
- Форма входа → `signIn` из AuthContext
- Форма регистрации → `register` из AuthContext
- Форма восстановления пароля → `forgotPassword`
- Обработка ошибок API (422, 403 unverified email)

---

## Блок 2: Каталог и контент

### 2.1 HomePage — данные с API
- `GET /home` → hero, about, категории с товарами
- Заменить статические данные из `data/products.js`

### 2.2 CatalogPage — реальный каталог
- `GET /products` с параметрами: page, per_page, search, category, price_from/to, sort, is_new, is_bestseller
- `GET /categories` для дерева категорий в sidebar
- Пагинация из API (`meta.total`, `meta.last_page`)
- Фильтры и сортировка через URL query params

### 2.3 ProductPage — реальный товар
- `GET /products/:slug` → данные товара, связанные товары, breadcrumbs, изображения
- Slug вместо id в URL (обновить роут: `/product/:slug`)

### 2.4 CartContext — переработка
- Хранить в cart только `{ id, qty }` (цены берутся из API при отображении)
- `POST /order/calculate` для пересчёта итогов + промокоды
- localStorage для персистенции корзины

### 2.5 FavoritesPage — адаптация
- Избранное остаётся в localStorage
- Для отображения: загружать данные продуктов по ids через API (или кешировать)

---

## Блок 3: Пользовательский кабинет

### 3.1 ProfilePage — реальный профиль
- `GET /profile` → данные пользователя
- `PATCH /profile` → обновление данных
- Redirect если нет токена

### 3.2 OrderHistory — из API
- `GET /orders` с пагинацией
- Статусы заказов, повторная оплата (`POST /payments`)

### 3.3 Chat (Topics) — из API
- `GET /topics` — список тем
- `GET /topics/:id` — тема с сообщениями
- `POST /topics` — создание темы (с вложениями)
- `POST /topics/:id/messages` — отправка сообщения (multipart)
- `GET /topics/unread-count` — polling непрочитанных
- Вложения: загрузка файлов (jpeg, png, webp, pdf)

### 3.4 ChangePassword
- `POST /change-password` с current_password + new_password

---

## Блок 4: Заказ и оплата

### 4.1 CheckoutPage — полная переработка
- Расчёт заказа: `POST /order/calculate` (items + promo_code)
- DaData подсказки: `POST /order/address/suggest`
- Расчёт доставки: `POST /shipping/calculate`
- Создание заказа: `POST /order`
- Опция регистрации при заказе (register: true + password)
- Типы доставки: PostOffice, Cdek

### 4.2 Payments
- `POST /payments` → получить payment_url → redirect на страницу банка
- `/payment-success` и `/payment-error` — страницы результата

### 4.3 Новые роуты
- `/payment-success` (вместо `/order-success`)
- `/payment-error` (вместо `/order-error`)

---

## Блок 5: Статические страницы и прочее

### 5.1 StaticPage — данные из API
- `GET /pages/:id` для каждой страницы (delivery=3, return=4, contacts=5, oferta=6, politics=7)
- Рендер HTML через `dangerouslySetInnerHTML`

### 5.2 Header — интеграция
- Категории из API для меню
- Auth state (аватар/имя, logout)
- Корзина count из CartContext

### 5.3 Footer — контакты из API
- `GET /pages/5` (контакты)

### 5.4 Новые страницы
- `/verify-registration/:user/:hash` — верификация email
- `/reset-password` — сброс пароля (форма с token из query)

### 5.5 Удаление статических данных
- Удалить `src/data/products.js` (заменён API)
- Удалить `src/data/iconMap.js` (если не нужен)
- Обновить `src/components/Icons.jsx` при необходимости

---

## Допущения и будущие доработки

- **Избранное на бэкенде** — пока localStorage, позже можно добавить API
- **Поиск** — через `GET /products?search=...` (есть на бэкенде)
- **Тёмные/светлые темы** — оставляем как есть
- **Тесты** — после завершения миграции
- **SEO** — meta-теги из API (при необходимости)
