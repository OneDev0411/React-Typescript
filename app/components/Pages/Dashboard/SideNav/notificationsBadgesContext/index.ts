import { createContext } from 'react'

import { initialNotificationsBadgesContextValue } from './initialValues'

export const NotificationsBadgesContext = createContext(
  initialNotificationsBadgesContextValue
)
