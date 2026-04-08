import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../api/categories'
import { IconChevronRight, IconChevronDown, IconMenu } from '../Icons'
import styles from './Header.module.css'

function CatalogItem({ item, onClose }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div
      className={styles.catItem}
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
    >
      <Link to={item.href} className={styles.catDropdownLink} onClick={onClose}>
        <span>{item.label}</span>
        {hasChildren && <IconChevronRight size={12} className={styles.catSubArrow} />}
      </Link>
      {hasChildren && open && (
        <div className={styles.catSubmenu}>
          {item.children.map((child) => (
            <Link key={child.label} to={child.href} className={styles.catSubmenuLink} onClick={onClose}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function mapCategory(cat) {
  const item = {
    label: cat.name,
    href: `/catalog?category=${cat.slug}`,
  }
  if (cat.children?.length) {
    item.children = cat.children.map((child) => ({
      label: child.name,
      href: `/catalog?category=${child.slug}`,
    }))
  }
  return item
}

export default function CatalogDropdown({ open, onToggle, onClose, catalogRef }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    getCategories()
      .then((res) => {
        const data = res.data?.data ?? res.data
        const cats = Array.isArray(data) ? data : []
        setItems([
          { label: 'Все товары', href: '/catalog' },
          ...cats.map(mapCategory),
        ])
      })
      .catch(() => setItems([{ label: 'Все товары', href: '/catalog' }]))
  }, [])

  return (
    <>
      <button
        className={`${styles.catToggle} ${open ? styles.catToggleOpen : ''}`}
        onClick={onToggle}
      >
        <IconMenu size={18} />
        Каталог
        <IconChevronDown size={12} className={`${styles.catArrow} ${open ? styles.catArrowOpen : ''}`} />
      </button>

      {open && (
        <div className={styles.catDropdown}>
          {items.map((item) => (
            <CatalogItem key={item.label} item={item} onClose={onClose} />
          ))}
        </div>
      )}
    </>
  )
}
