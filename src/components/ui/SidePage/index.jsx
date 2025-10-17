import React from "react"

import Drawer from "rc-drawer"

import "rc-drawer/assets/index.css"

export const SidePage = ({ isOpen, children, toggle, width = 500 }) => {
  return (
    <Drawer open={isOpen} onClose={toggle} placement="right" width={width}>
      {children}
    </Drawer>
  )
}
