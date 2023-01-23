import { useContext } from 'react'

import { NotificationsBadgesContext } from './index'

export default function useNotificationsBadgesContext() {
  const context = useContext(NotificationsBadgesContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useNotificationsBadgesContext must be used within a NotificationsBadgesContext.Provider'
    )
  }

  return context
}
