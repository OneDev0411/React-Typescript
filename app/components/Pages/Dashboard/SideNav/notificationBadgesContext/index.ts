import { createContext } from 'react'

import { initialNotificationBadgesContextValue } from './initialValues'

export const NotificationBadgesContext = createContext(
  initialNotificationBadgesContextValue
)
