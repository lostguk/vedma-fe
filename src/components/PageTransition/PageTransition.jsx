import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './PageTransition.module.css'

export default function PageTransition({ children }) {
	const { pathname } = useLocation()
	const isInitial = useRef(true)

	useEffect(() => {
		isInitial.current = false
	}, [])

	return (
		<div
			key={pathname}
			className={isInitial.current ? undefined : styles.wrapper}
		>
			{children}
		</div>
	)
}
