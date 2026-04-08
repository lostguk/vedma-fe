# Архитектура vedma-fe-new

## Общее описание

**vedma-fe-new** — SPA-фронтенд интернет-магазина «Ведьмино Зелье» (эзотерические товары и услуги).
Полностью интегрирован с бэкендом **vedma-be** (Laravel 11, API v1).

---

## Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 18.3 | UI-фреймворк |
| Vite | 5.4 | Сборка, dev-сервер |
| React Router | 7.13 | Маршрутизация (SPA) |
| Axios | 1.14 | HTTP-клиент к API |
| react-toastify | 11.0 | Toast-уведомления |
| CSS Modules | — | Изолированные стили компонентов |
| CSS Variables | — | Темизация (3 палитры) |

**Нет TypeScript, нет Redux, нет styled-components.**

---

## Архитектурные слои

```
┌──────────────────────────────────────────────────────┐
│                     Браузер                          │
├──────────────────────────────────────────────────────┤
│  pages/              — Страницы (бизнес-логика)      │
│  components/         — UI-компоненты (представление)  │
│  context/            — Глобальный стейт (React Context)│
│  hooks/              — Переиспользуемая логика        │
│  api/                — HTTP-запросы к бэкенду         │
│  styles/             — Глобальные CSS-переменные      │
├──────────────────────────────────────────────────────┤
│                vedma-be (Laravel API v1)              │
│          http://localhost:8000/api/v1                 │
└──────────────────────────────────────────────────────┘
```

### Принцип: однонаправленный поток данных

```
API (api/) → Context (context/) → Pages/Components → UI
                                        ↓
                                  Действия пользователя
                                        ↓
                                  Context dispatch / API call
```

---

## Слой API (src/api/)

Все HTTP-запросы инкапсулированы в модулях `src/api/`. Компоненты и страницы **никогда** не создают Axios-запросы напрямую — только через функции из `api/`.

### client.js — ядро

```
apiClient = axios.create({ baseURL: VITE_API_URL })
  ├── Request Interceptor  → добавляет Bearer token из localStorage
  └── Response Interceptor → при 401 удаляет token
```

### Модули

| Файл | Ответственность | Ключевые функции |
|------|-----------------|------------------|
| `auth.js` | Аутентификация | login, register, logout, forgotPassword, resetPassword, changePassword, verifyRegistration, resendVerification |
| `products.js` | Товары | getProducts(params), getProduct(slug) |
| `categories.js` | Категории | getCategories(), getCategory(slug) |
| `orders.js` | Заказы | calculateOrder(items, promo), createOrder(data), getOrders() |
| `payments.js` | Оплата | createPayment(data), getPaymentStatus(id), refundPayment(id) |
| `profile.js` | Профиль | getProfile(), updateProfile(data) |
| `shipping.js` | Доставка | calculateShipping(products, address) |
| `home.js` | Главная | getHomeContent() |
| `topics.js` | Чат поддержки | getTopics, getTopic, createTopic, addMessage, getUnreadCount |
| `pages.js` | Статические стр. | getPages(), getPage(id) |
| `dadata.js` | DaData подсказки | suggestAddress(query, count) |

### Правило маппинга полей

Фронт использует **camelCase**, бэк — **snake_case**. Трансформация происходит в API-модулях:

```javascript
// api/auth.js
export function register(data) {
  return apiClient.post('/register', {
    first_name: data.firstName,   // camelCase → snake_case
    last_name: data.lastName,
    middle_name: data.middleName || '',
    // ...
  })
}
```

---

## Стейт-менеджмент (src/context/)

4 независимых React Context, каждый со своим Provider и хуком.

### Дерево провайдеров (main.jsx)

```jsx
<ThemeProvider>
  <CartProvider>
    <FavoritesProvider>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </FavoritesProvider>
  </CartProvider>
</ThemeProvider>
```

### AuthContext

| Свойство / Метод | Тип | Описание |
|-------------------|-----|----------|
| `user` | object \| null | Данные пользователя из API |
| `loading` | boolean | Идёт ли bootstrap (проверка токена) |
| `isAuthenticated` | boolean | `Boolean(user)` |
| `signIn(email, password)` | async | Логин → сохранение token + user |
| `register(data)` | async | Регистрация (без auto-login) |
| `signOut()` | async | Выход → очистка token + user |
| `updateProfile(data)` | async | Обновление профиля |
| `forgotPassword(email)` | async | Запрос сброса пароля |
| `resetPassword(data)` | async | Сброс пароля по token |
| `changePassword(data)` | async | Смена пароля (текущий + новый) |
| `refreshUser()` | async | Перезагрузка данных пользователя |

**Хранение:** token в localStorage (`vedmino-token`), user в React state.
**Bootstrap:** при mount проверяет наличие token → если есть, делает `GET /profile` для восстановления сессии.

### CartContext

| Свойство / Метод | Тип | Описание |
|-------------------|-----|----------|
| `items` | array | `[{ id, qty, name, price, old_price, image, slug }]` |
| `totalItems` | number | Общее кол-во единиц |
| `totalPrice` | number | Общая сумма |
| `addToCart(product, qty)` | function | Добавляет **полный объект** товара |
| `updateQty(id, qty)` | function | Изменяет кол-во (0 = удалить) |
| `removeFromCart(id)` | function | Удаляет товар |
| `clearCart()` | function | Очищает корзину |
| `getItemQty(id)` | function | Кол-во товара в корзине |
| `drawerOpen` | boolean | Открыта ли корзина-drawer |
| `toast` | object \| null | Toast при добавлении товара |

**Важно:** `addToCart` принимает **объект product**, не просто id. Проверяет `in_stock !== false`.
**Хранение:** localStorage (`vedmino-cart-v2`), формат: полные данные товара, чтобы корзина работала без API.

### FavoritesContext

| Свойство / Метод | Тип | Описание |
|-------------------|-----|----------|
| `ids` | string[] | Массив ID избранных товаров |
| `count` | number | Количество |
| `toggleFavorite(id)` | function | Добавить/убрать |
| `isFavorite(id)` | function | Проверка |

**Полностью клиентское.** Для отображения данных товаров используется `GET /products?ids=...`.

### ThemeContext

| Свойство / Метод | Тип | Описание |
|-------------------|-----|----------|
| `theme` | string | Текущая тема: botanical / amber / mystical |
| `setTheme(id)` | function | Установить тему |
| `cycleTheme()` | function | Переключить на следующую |
| `themes` | array | Массив всех тем с цветами |

**Механизм:** `data-theme` атрибут на `<html>` → CSS-переменные в `variables.css`.

---

## Маршрутизация

Определена в `src/App.jsx`. BrowserRouter + Routes.

### Обёртка AppContent

```jsx
function AppContent() {
  useScrollToTop()       // скролл вверх при смене страницы
  return (
    <>
      <Header />
      <main>
        <PageTransition>  {/* key={pathname} — CSS-анимация при переходе */}
          <Routes>...</Routes>
        </PageTransition>
      </main>
      <Footer />
      <FloatingPanel />   {/* переключение темы */}
      <CartToast />        {/* toast при добавлении в корзину */}
      <CookieBanner />
      <AgeGate />          {/* 18+ подтверждение */}
    </>
  )
}
```

### Полный список маршрутов

| Путь | Компонент | Auth |
|------|-----------|------|
| `/` | HomePage | - |
| `/catalog` | CatalogPage | - |
| `/product/:slug` | ProductPage | - |
| `/favorites` | FavoritesPage | - |
| `/checkout` | CheckoutPage | - (регистрация при заказе) |
| `/order-success` | OrderSuccessPage | - |
| `/order-error` | OrderErrorPage | - |
| `/payment-success` | OrderSuccessPage | - |
| `/payment-error` | OrderErrorPage | - |
| `/profile/*` | ProfilePage | Редирект на /catalog если не auth |
| `/delivery` | StaticPage | - |
| `/returns` | StaticPage | - |
| `/contacts` | StaticPage | - |
| `/privacy` | StaticPage | - |
| `/offer` | StaticPage | - |
| `/verify-registration/:user/:hash` | VerifyEmailPage | - |
| `/reset-password` | ResetPasswordPage | - |

---

## Стилизация

### Подход: CSS Modules + CSS Variables

Каждый компонент имеет свой `.module.css`. Глобальные переменные определены в `styles/variables.css`.

### Темы

3 цветовые палитры, переключаемые через `data-theme` на `<html>`:

| Тема | Основной цвет | Акцент |
|------|--------------|--------|
| `botanical` | #6B7F5E (зелёный) | #C4A265 (золотой) |
| `amber` | #C2703E (янтарный) | #D4A03C (золотой) |
| `mystical` | #7B5EA7 (фиолетовый) | #B088C4 (лавандовый) |

### Шрифты

- **Заголовки:** Cormorant Garamond (serif)
- **Текст:** Inter (sans-serif)
- Подключены через Google Fonts в `index.html`

---

## Ключевые UX-паттерны

### Плавные переходы между страницами

`PageTransition` компонент использует `key={pathname}` для remount + CSS `@keyframes` (fade-in с blur и translateY).

### Скролл вверх при навигации

`useScrollToTop()` — при изменении `pathname` делает `window.scrollTo({ top: 0, behavior: 'instant' })`.

### Scroll Reveal анимации

`useScrollReveal()` — IntersectionObserver + MutationObserver (для динамически загруженного контента).
Элементы с классом `.reveal` получают `.visible` при попадании в viewport.

### Ленивая загрузка изображений

`LazyImage` — shimmer-скелетон → fade-in при `onLoad`. `loading="lazy"` для нативной ленивой загрузки.

### Skeleton-загрузчики

`ProductCardSkeleton` — используется в `CatalogPage` и `FavoritesPage` вместо текстового «Загрузка...».

---

## Интеграции

### DaData (адресные подсказки)

- Проксируется через бэкенд: `POST /api/v1/order/address/suggest`
- Компонент: `AddressInput` (`components/ui/AddressInput/`)
- Debounce: 300ms
- Валидация: обязательно выбрать из подсказок, проверка полноты (улица + дом + город)

### Альфа-Банк (платежи)

- `POST /payments` → получение `payment_url` → redirect
- Success/fail URL передаются при создании платежа
- При ошибке: возможность повторной оплаты или перехода в ЛК

### Metaship (доставка)

- `POST /shipping/calculate` с products + address
- Расчёт автоматический при подтверждённом адресе
- Категории с `exclude_from_shipping` исключаются на бэкенде
