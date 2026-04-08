import { useEffect, useRef } from 'react'

export default function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold },
    )

    const observeAll = () => {
      node.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el))
    }

    observeAll()

    const mo = new MutationObserver(observeAll)
    mo.observe(node, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [threshold])

  return ref
}
