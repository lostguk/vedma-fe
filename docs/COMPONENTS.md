# Справочник компонентов — vedma-fe-new

## UI-библиотека (src/components/ui/)

Импорт через barrel: `import { Button, Breadcrumbs, ... } from '../../components/ui'`

### Button

Универсальная кнопка с вариантами.

```jsx
<Button variant="primary" size="lg" fullWidth disabled={loading}>
  {loading ? 'Загрузка...' : 'Сохранить'}
</Button>

<Button as={Link} to="/catalog" variant="ghost" size="md">
  В каталог
</Button>
```

| Prop | Тип | Описание |
|------|-----|----------|
| `variant` | `'primary' \| 'ghost' \| 'outline'` | Стиль кнопки |
| `size` | `'sm' \| 'md' \| 'lg'` | Размер |
| `fullWidth` | boolean | Растянуть на всю ширину |
| `as` | component | Рендерить как другой элемент (Link и т.д.) |
| `disabled` | boolean | Неактивная кнопка |

### Breadcrumbs

Хлебные крошки.

```jsx
<Breadcrumbs items={[
  { label: 'Главная', to: '/' },
  { label: 'Каталог', to: '/catalog' },
  { label: 'Товар' }  // без to = текущая страница
]} />
```

### PageShell

Обёртка страницы (container + className).

```jsx
<PageShell className={styles.shell}>
  <h1>Заголовок</h1>
  <p>Контент</p>
</PageShell>
```

### EmptyState

Пустое состояние (нет данных).

```jsx
<EmptyState
  icon={<IconSearch size={56} strokeWidth={1} />}
  title="Товары не найдены"
  description="Попробуйте изменить параметры фильтра"
  actionLabel="Сбросить фильтры"
  onAction={resetFilters}
  // или:
  actionTo="/catalog"  // как Link
/>
```

### GlassCard

Карточка с эффектом glassmorphism.

```jsx
<GlassCard maxWidth={480}>
  <h1>Заголовок</h1>
  <p>Контент</p>
</GlassCard>
```

### LazyImage

Картинка с ленивой загрузкой и skeleton-placeholder.

```jsx
<LazyImage
  src={imageUrl}
  alt="Описание"
  className={styles.image}
  aspectRatio="1"          // резервирует место
/>
```

### AddressInput

Поле ввода адреса с DaData-автокомплитом.

```jsx
<AddressInput
  value={address}
  onChange={(text, dadataItem) => { ... }}
  onSelect={(dadataItem) => { ... }}
  placeholder="Начните вводить адрес..."
  disabled={false}
  error="Выберите адрес из подсказок"
/>
```

| Prop | Тип | Описание |
|------|-----|----------|
| `value` | string | Текст адреса |
| `onChange` | (text, dadataItem \| null) => void | При ручном вводе dadataItem=null |
| `onSelect` | (dadataItem) => void | При выборе из подсказок |
| `placeholder` | string | Placeholder |
| `disabled` | boolean | Отключено |
| `error` | string | Текст ошибки |

### SectionHeader

Заголовок секции на главной странице.

### IconButton

Кнопка-иконка (круглая).

---

## Основные компоненты

### Header (components/Header/)

Состоит из:
- **TopBar** — верхняя полоска (контакты, соцсети)
- **MidBar** — логотип + навигация + бургер (sticky при скролле)
- **CatBar** — каталог dropdown + поиск + action-кнопки (кабинет, избранное, корзина)
- **MobileMenu** — мобильное меню
- **CatalogDropdown** — выпадающий каталог с категориями из API

Поиск: форма отправляет на `/catalog?search=query`. Синхронизация строки поиска с URL.

### ProductCard (components/ProductSection/ProductCard.jsx)

Карточка товара. Используется в CatalogPage, HomePage, FavoritesPage, ProductPage (related).

```jsx
<ProductCard product={productObject} />
```

Автоматически:
- Определяет изображение (thumb_url → preview_url → image_url → image)
- Показывает тег (is_bestseller / is_new)
- Показывает скидку (old_price vs price)
- Показывает «Нет в наличии» (in_stock === false)
- Показывает счётчик кол-ва если товар в корзине
- Кнопка избранного

### ProductCardSkeleton (components/ProductSection/ProductCardSkeleton.jsx)

Скелетон-загрузчик для карточки товара.

```jsx
{Array.from({ length: 9 }).map((_, i) => (
  <ProductCardSkeleton key={i} />
))}
```

### LoginModal (components/LoginModal/LoginModal.jsx)

Модальное окно с 3 режимами:
1. **login** — вход (email + пароль)
2. **register** — регистрация (ФИО + email + пароль + согласие)
3. **forgot** — восстановление пароля (email)

```jsx
<LoginModal
  open={loginOpen}
  onClose={() => setLoginOpen(false)}
  onAuthSuccess={() => { ... }}  // callback после успешного логина
/>
```

### CartModal (components/CartModal/CartModal.jsx)

Drawer-корзина. Открывается через `useCart().openDrawer`.
Берёт данные товаров напрямую из CartContext.items (полные данные).

### PageTransition (components/PageTransition/PageTransition.jsx)

Плавный переход между страницами.

```jsx
<PageTransition>
  <Routes>...</Routes>
</PageTransition>
```

Использует `key={pathname}` для remount + CSS @keyframes анимация (fade-in с blur).

### Hero (components/Hero/Hero.jsx)

Слайдер на главной странице.

```jsx
<Hero slides={slidesFromApi} />
```

Слайды приходят из `GET /home` → `data.slides`.

### Lightbox (components/Lightbox/Lightbox.jsx)

Просмотр изображений в полноэкранном режиме.

```jsx
<Lightbox
  images={[{ preview: url, name: 'file.jpg' }]}
  startIndex={0}
  onClose={() => setLightbox(null)}
/>
```

Используется в TabChat для просмотра вложений.

### Icons (components/Icons.jsx)

Все SVG-иконки централизованно. Именованные экспорты:
`IconUser`, `IconHeart`, `IconBag`, `IconSearch`, `IconCheck`, `IconX`, `IconChevronDown`,
`IconChevronLeft`, `IconChevronRight`, `IconFilter`, `IconTruck`, `IconMapPin`, `IconMail`,
`IconChat`, `IconSend`, `IconPaperclip`, `IconStar`, `IconArrowRight`, `BotanicalDivider` и др.

```jsx
import { IconHeart, IconBag } from '../Icons'

<IconHeart size={18} fill="currentColor" />
<IconBag size={16} />
```

---

## Страницы

### HomePage (pages/HomePage.jsx)

- Загружает `GET /home` → slides + categories с товарами
- `Hero` (слайдер) → категории через `ProductSection` → `Features` → `About`
- Фильтрует пустые категории
- `useScrollReveal` для анимации появления секций

### CatalogPage (pages/CatalogPage/)

- Загружает `GET /products` + `GET /categories`
- Фильтры: категория, ценовой диапазон (range slider), поиск, сортировка
- Всё через URL query params (`useSearchParams`)
- Range slider с debounce 200ms
- Пагинация
- ProductCardSkeleton при загрузке

### ProductPage (pages/ProductPage/)

- Загружает `GET /products/:slug`
- Галерея изображений с миниатюрами
- Табы: описание / доставка / отзывы
- Related товары
- In stock / out of stock
- Добавление в корзину с выбором кол-ва

### CheckoutPage (pages/CheckoutPage/)

Состоит из 4 подкомпонентов:
- **CheckoutContactSection** — ФИО, телефон (маска), email, пароль (для незарегистрированных)
- **CheckoutDeliverySection** — адрес (DaData) + тип доставки (Почта России)
- **CheckoutSummary** — корзина + промокод + итого + кнопка оформления
- **usePromoCode** — хук для работы с промокодами

Flow:
1. Заполнение формы → валидация
2. `POST /order` → создание заказа
3. `POST /payments` → получение payment_url → redirect
4. При ошибке: баннер с «Повторить оплату» / «Оплатить позже»

### ProfilePage (pages/ProfilePage/)

Один файл с 4 внутренними табами:
- **TabInfo** — редактирование профиля (ФИО, телефон, email, адрес DaData)
- **TabOrders** — история заказов с возможностью оплаты / повтора
- **TabChat** — чат поддержки (темы + сообщения + вложения)
- **TabPassword** — смена пароля

Redirect на `/catalog` если не авторизован.
Polling непрочитанных сообщений каждые 10 секунд.
