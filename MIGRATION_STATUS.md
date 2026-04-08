# Статус миграции vedma-fe → vedma-fe-new

## Условные обозначения
- ⬜ — не начато
- 🔄 — в работе
- ✅ — готово
- ❌ — заблокировано / проблема

---

## Блок 1: Инфраструктура (API-слой + Auth)

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 1.1 | Env-файлы (.env, .env.production, .gitignore) | ✅ | .env + .env.production + .gitignore обновлён |
| 1.2 | Установить axios | ✅ | npm install axios |
| 1.3 | API-клиент (src/api/client.js) | ✅ | Singleton, interceptors, token management |
| 1.4 | API-эндпоинты (src/api/*.js) | ✅ | 11 модулей: auth, profile, products, categories, orders, payments, pages, topics, shipping, home, dadata + barrel index.js |
| 1.5 | AuthContext → реальный API | ✅ | JWT Bearer, bootstrap по токену, signIn/register/signOut/updateProfile/forgotPassword/resetPassword/changePassword |
| 1.6 | LoginModal → реальный API | ✅ | Login/Register/ForgotPassword с обработкой ошибок API, loading state, email verification flow |

## Блок 2: Каталог и контент

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 2.1 | HomePage → GET /home | ✅ | Категории с товарами из API, Hero/About/Features — статика |
| 2.2 | CatalogPage → GET /products + categories | ✅ | Фильтры, сортировка, пагинация через API, категории в sidebar, URL query params |
| 2.3 | ProductPage → GET /products/:slug | ✅ | Роут /product/:slug, breadcrumbs, галерея изображений, related products из API |
| 2.4 | CartContext → хранение полных данных товара | ✅ | addToCart принимает product object, localStorage vedmino-cart-v2, CartModal без allProducts |
| 2.5 | FavoritesPage → загрузка данных по ids | ✅ | GET /products?ids=1,2,3 + скелетоны при загрузке |

## Блок 3: Пользовательский кабинет

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 3.1 | ProfilePage → GET/PATCH /profile | ✅ | API поля (first_name, last_name, middle_name), async save с ошибками |
| 3.2 | OrderHistory → GET /orders | ✅ | GET /orders, статусы, позиции, промокоды, доставка |
| 3.3 | Chat (Topics) → полная интеграция | ✅ | GET/POST /topics, POST /messages, вложения multipart, unread polling 10s |
| 3.4 | ChangePassword → POST /change-password | ✅ | current_password + new_password, мин 8 символов, ошибки API |

## Блок 4: Заказ и оплата

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 4.1 | CheckoutPage → POST /order + calculate + dadata + shipping | ✅ | POST /order, DaData адрес, маска телефона, выбор доставки PostOffice/Cdek, регистрация при заказе |
| 4.2 | Payments → POST /payments + redirect | ✅ | POST /payments → redirect на payment_url Альфа-Банка |
| 4.3 | Новые роуты (payment-success/error) | ✅ | /payment-success, /payment-error (те же компоненты) |

## Блок 5: Статические страницы и прочее

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 5.1 | StaticPage → GET /pages/:id | ✅ | delivery=3, return=4, contacts=5 из API; privacy/offer — статичные юр. тексты |
| 5.2 | Header → категории из API + auth | ✅ | CatalogDropdown и MobileMenu загружают категории из API |
| 5.3 | Footer → категории из API | ✅ | Секция «Каталог» в footer из API |
| 5.4 | Новые страницы (verify-registration, reset-password) | ✅ | /verify-registration/:user/:hash и /reset-password с формой |
| 5.5 | Удаление статических данных | ✅ | data/products.js больше не используется в основных страницах |

---

## Баги и проблемы

| Описание | Блок | Статус |
|----------|------|--------|
| — | — | — |

---

## Правила работы

- **Валидация:** Всегда сверять правила валидации на фронте с `app/Http/Requests/Api/V1/` на бэкенде. Минимальная длина пароля, обязательность полей, форматы — должны совпадать. Детальную валидацию делает бэкенд, фронт показывает ошибки API через `getApiErrors()`.
- **Структура данных:** Всегда проверять реальный ответ API (`curl` / Network tab) перед написанием парсинга. Формат envelope: `res.data.data` для ресурса, `res.data.data` + `res.data.meta` для пагинации. ProductController@index — исключение: `res.data.data` + `res.data.meta` напрямую (без envelope).
- **Асинхронные данные + DOM:** При загрузке данных из API элементы добавляются в DOM позже. Хуки/обсерверы, которые работают с DOM при mount, должны учитывать динамический контент (MutationObserver, повторные вызовы и т.п.).

---

## Доработки бэкенда (если понадобятся)

| Описание | Статус |
|----------|--------|
| — | — |
