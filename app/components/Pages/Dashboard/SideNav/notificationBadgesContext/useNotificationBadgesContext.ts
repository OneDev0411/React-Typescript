import { useContext } from 'react'

import { NotificationBadgesContext } from './index'

export default function useNotificationBadgesContext() {
  const context = useContext(NotificationBadgesContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useNotificationBadgesContext must be used within a NotificationBadgesContext.Provider'
    )
  }

  return context
}
