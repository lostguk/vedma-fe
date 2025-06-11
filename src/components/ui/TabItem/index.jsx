import React from "react"

export const TabItem = ({ tab, currentTab, children }) => {
  if (tab === currentTab) {
    return children
  }

  return null
}
