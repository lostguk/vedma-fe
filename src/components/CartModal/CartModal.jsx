import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { EmptyState, Button, LazyImage } from '../ui'
import { IconBag, IconX, IconArrowRight } from '../Icons'
import styles from './CartModal.module.css'

export default function CartModal() {
  const {
    items,
    drawerOpen,
    closeDrawer,
    updateQty,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart()

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
      const onKey = (e) => e.key === 'Escape' && closeDrawer()
      window.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKey)
      }
    }
    document.body.style.overflow = ''
    return undefined
  }, [drawerOpen, closeDrawer])

  return createPortal(
    <>
      <div
        className={`${styles.overlay} ${drawerOpen ? styles.overlayOpen : ''}`}
        onClick={closeDrawer}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!drawerOpen}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>
            Корзина
            {totalItems > 0 && (
              <span className={styles.count}>{totalItems}</span>
            )}
          </h3>
          <button
            className={styles.closeBtn}
            onClick={closeDrawer}
            aria-label="Закрыть"
          >
            <IconX size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<IconBag size={56} strokeWidth={1} />}
            title="Корзина пуста"
            description="Добавьте товары из каталога"
            actionLabel="Перейти в каталог"
            actionTo="/catalog"
            onAction={closeDrawer}
          />
        ) : (
          <>
            <div className={styles.items}>
              {items.map((line) => (
                <div key={line.id} className={styles.item}>
                  <img
                    src={line.image}
                    alt={line.name}
                    className={styles.itemImg}
                  />
                  <div className={styles.itemBody}>
                    <div className={styles.itemTop}>
                      <h4 className={styles.itemName}>{line.name}</h4>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(line.id)}
                        aria-label="Удалить"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                    <div className={styles.itemBottom}>
                      <div className={styles.qtyControl}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => updateQty(line.id, line.qty - 1)}
                        >
                          −
                        </button>
                        <span className={styles.qtyValue}>{line.qty}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => updateQty(line.id, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className={styles.itemPrice}>
                        {((line.price || 0) * line.qty).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Итого</span>
                <span className={styles.totalValue}>
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <Button as={Link} to="/checkout" variant="primary" size="lg" fullWidth onClick={closeDrawer}>
                Оформить заказ
                <IconArrowRight size={16} />
              </Button>
              <button type="button" className={styles.continueBtn} onClick={closeDrawer}>
                Продолжить покупки
              </button>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body,
  )
}
