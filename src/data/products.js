export const categories = [
  { id: 'all', label: 'Все товары' },
  {
    id: 'candles',
    label: 'Свечи',
    children: [
      { id: 'candles-ritual', label: 'Ритуальные свечи' },
      { id: 'candles-herbs', label: 'Свечи с травами' },
      { id: 'candles-altar', label: 'Алтарные свечи' },
      { id: 'candles-figure', label: 'Фигурные свечи' },
    ],
  },
  {
    id: 'potions',
    label: 'Зелья и масла',
    children: [
      { id: 'potions-herbal', label: 'Травяные зелья' },
      { id: 'potions-oils', label: 'Колдовские масла' },
      { id: 'potions-aroma', label: 'Ароматические смеси' },
    ],
  },
  {
    id: 'artifacts',
    label: 'Артефакты',
    children: [
      { id: 'artifacts-amulets', label: 'Обереги и амулеты' },
      { id: 'artifacts-talismans', label: 'Талисманы' },
      { id: 'artifacts-runes', label: 'Руны' },
    ],
  },
  {
    id: 'tools',
    label: 'Инструменты',
    children: [
      { id: 'tools-candle', label: 'Подсвечники' },
      { id: 'tools-tarot', label: 'Карты Таро' },
      { id: 'tools-altar', label: 'Алтарные принадлежности' },
    ],
  },
  { id: 'sets', label: 'Наборы' },
]

export const allProducts = [
  {
    id: 'candle-1',
    icon: 'candle',
    category: 'candles-ritual',
    name: 'Очищение Ведьмы',
    description: 'Восковая свеча с шалфеем и лавандой для очищения пространства и гармонизации энергии.',
    price: 2790,
    oldPrice: 3200,
    tag: 'Хит продаж',
    image: 'https://blackcandle.ru/image/cache/catalog/svechi/zamena/Svecha–ritual«Ochischenieotporchi»-400x400.jpg',
    popularity: 95,
    createdAt: '2025-12-01',
  },
  {
    id: 'candle-2',
    icon: 'candle',
    category: 'candles-altar',
    name: 'Лучи Солнца',
    description: 'Фигурная восковая свеча для алтарных практик. Горит ровно и долго.',
    price: 4430,
    oldPrice: null,
    image: 'https://blackcandle.ru/image/cache/catalog/svechi/travi/LuchiSolnca-400x400.jpg',
    popularity: 70,
    createdAt: '2026-01-15',
  },
  {
    id: 'candle-3',
    icon: 'candle',
    category: 'candles-herbs',
    name: 'Весеннее Обновление',
    description: 'Свеча с полынью и зверобоем. Создаёт защитный барьер в пространстве.',
    price: 3270,
    oldPrice: 3800,
    tag: 'Новинка',
    image: 'https://blackcandle.ru/image/cache/catalog/2025/svechizemlyaniezamena/vesenneeobnovlenie(3)-400x400.jpg',
    popularity: 85,
    createdAt: '2026-03-01',
  },
  {
    id: 'candle-4',
    icon: 'candle',
    category: 'candles-ritual',
    name: 'Возьму твоё сердце',
    description: 'Ритуальная свеча с инструкцией для любовных практик.',
    price: 6900,
    oldPrice: null,
    tag: 'Премиум',
    image: 'https://blackcandle.ru/image/cache/catalog/2026/svechi/Svecha«Vozmutvoeserdce»/20260206_154545(1)-400x400.jpg',
    popularity: 80,
    createdAt: '2026-02-06',
  },
  {
    id: 'potion-1',
    icon: 'potion',
    category: 'potions-herbal',
    name: 'Дар Остары',
    description: 'Колдовское масло для весенних ритуалов. Закрытый рецепт на основе редких трав.',
    price: 5200,
    oldPrice: 6100,
    tag: 'Новинка',
    image: 'https://blackcandle.ru/image/cache/catalog/2026/maslo/dar-ostari/IMG_20250718_142528-400x400.jpg',
    popularity: 88,
    createdAt: '2026-02-10',
  },
  {
    id: 'potion-2',
    icon: 'sparkles',
    category: 'potions-aroma',
    name: 'Колдовское масло «Лилит»',
    description: 'Закрытый рецепт на основе редких трав. Усиливает женскую энергию.',
    price: 8200,
    oldPrice: null,
    image: 'https://blackcandle.ru/image/cache/catalog/2026/maslo/lilit/Picsart_26-03-18_17-30-29-760-400x400.jpg',
    popularity: 72,
    createdAt: '2025-11-20',
  },
  {
    id: 'artifact-1',
    icon: 'shield',
    category: 'artifacts-amulets',
    name: 'Финансовый Поток',
    description: 'Свеча с амулетом для привлечения финансового благополучия.',
    price: 6530,
    oldPrice: 7200,
    tag: 'Популярное',
    image: 'https://blackcandle.ru/image/cache/catalog/svechi/zamena/Svecha«Finansovijpotok»samuletom-400x400.jpg',
    popularity: 92,
    createdAt: '2025-10-15',
  },
  {
    id: 'artifact-2',
    icon: 'moon',
    category: 'artifacts-talismans',
    name: 'Змеиная Хватка',
    description: 'Восковая свеча с инструкцией для защитных ритуалов.',
    price: 7399,
    oldPrice: null,
    image: 'https://blackcandle.ru/image/cache/catalog/2025/svecha-ritual/zmeinayahvatka(6)-300x300.jpg',
    popularity: 78,
    createdAt: '2026-02-20',
  },
  {
    id: 'artifact-3',
    icon: 'crystal',
    category: 'artifacts-amulets',
    name: 'Круг Силы',
    description: 'Свеча с амулетом для усиления энергетического поля.',
    price: 5290,
    oldPrice: 6000,
    image: 'https://blackcandle.ru/image/cache/catalog/2025/ochischenie/krugsili(4)-300x300.jpg',
    popularity: 65,
    createdAt: '2026-03-10',
  },
  {
    id: 'tool-1',
    icon: 'candle',
    category: 'tools-candle',
    name: 'Прощальное Пламя',
    description: 'Восковая свеча для ритуалов прощания и отпускания.',
    price: 3170,
    oldPrice: null,
    image: 'https://blackcandle.ru/image/cache/catalog/2025/svecha-ritual/proschalnoeplamyasvecha-ritual(6)-300x300.jpg',
    popularity: 55,
    createdAt: '2025-09-01',
  },
  {
    id: 'tool-2',
    icon: 'moon',
    category: 'tools-tarot',
    name: 'Денежный Щит',
    description: 'Свеча с инструкцией для финансовой защиты.',
    price: 4200,
    oldPrice: 4800,
    tag: 'Хит продаж',
    image: 'https://blackcandle.ru/image/cache/catalog/2024/new/denezhnijschit(2)-300x300.JPG',
    popularity: 90,
    createdAt: '2026-01-20',
  },
  {
    id: 'set-1',
    icon: 'crystal',
    category: 'sets',
    name: 'Врата Нави',
    description: 'Свеча для глубоких медитативных практик и работы с тонкими мирами.',
    price: 5200,
    oldPrice: 6500,
    tag: 'Набор',
    image: 'https://blackcandle.ru/image/cache/catalog/2025/svecha-ritual/vratanavi(1)-300x300.png',
    popularity: 82,
    createdAt: '2026-02-01',
  },
]

export function getCategoryIds(catId) {
  if (catId === 'all') return null
  const cat = categories.find(c => c.id === catId)
  if (cat?.children) return [cat.id, ...cat.children.map(c => c.id)]
  return [catId]
}

export function countByCategory(catId) {
  if (catId === 'all') return allProducts.length
  const ids = getCategoryIds(catId)
  return allProducts.filter(p => ids.includes(p.category)).length
}

export const candlesProducts = allProducts.filter(p =>
  ['candle-1', 'candle-2', 'candle-3', 'candle-4'].includes(p.id)
)

export const artifactsProducts = allProducts.filter(p =>
  ['artifact-1', 'artifact-2', 'artifact-3', 'potion-1'].includes(p.id)
)
