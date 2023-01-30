import { ComponentType, useContext } from 'react'

import { initialNotificationBadgesContextValue } from './initialValues'

import { NotificationBadgesContext } from './index'

export interface IWithNotificationBadgeProps {
  notificationBadges: typeof initialNotificationBadgesContextValue
}

export function withNotificationBadge<T>(Component: ComponentType<T>) {
  return (props: T) => {
    const notificationBadges = useContext(NotificationBadgesContext)

    return <Component {...props} notificationBadges={notificationBadges} />
  }
}
