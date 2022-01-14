import React, { ReactNode } from 'react'

import { useDispatch } from 'react-redux'

import { toggleChatbar } from '../../../../../store_actions/chatroom'

import SideNavButtonItem from './SideNavButtonItem'

interface Props {
  children: ReactNode
}

export default function MessageDrawerTrigger({ children }: Props) {
  const dispatch = useDispatch()

  const openDrawer = () => {
    if (!window.location.pathname.includes('/recents/')) {
      dispatch(toggleChatbar())
    }
  }

  return <SideNavButtonItem onClick={openDrawer}>{children}</SideNavButtonItem>
}
