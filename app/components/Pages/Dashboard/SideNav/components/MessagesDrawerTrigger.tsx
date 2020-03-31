import React from 'react'
import { useDispatch } from 'react-redux'

import { toggleChatbar } from '../../../../../store_actions/chatroom'
import SideNavButtonItem from './SideNavButtonItem'

export default function MessageDrawerTrigger() {
  const dispatch = useDispatch()

  const openDrawer = () => {
    if (!window.location.pathname.includes('/recents/')) {
      dispatch(toggleChatbar())
    }
  }

  return <SideNavButtonItem onClick={openDrawer}>Chat</SideNavButtonItem>
}
