import Drawer from "rc-drawer"

import { SidePageGlobalStyles } from './store'

import "rc-drawer/assets/index.css"

export const maskMotion = {
  motionAppear: true,
  motionName: 'mask-motion',
}

export const motion = placement => ({
  motionAppear: true,
  motionName: `panel-motion-${placement}`,
})

const motionProps = {
  maskMotion,
  motion,
}

export const SidePage = ({ isOpen, children, toggle, width = 420, placement = "right" }) => {
  return (
    <>
      <SidePageGlobalStyles  />

      <Drawer 
        open={isOpen}
        onClose={toggle}
        placement={placement}
        width={width}
        {...motionProps}
      >
        {children}
      </Drawer>
    </>
  )
}
