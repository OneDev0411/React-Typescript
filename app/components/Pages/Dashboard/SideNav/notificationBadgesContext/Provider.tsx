import { PropsWithChildren, useState, useEffect, useCallback } from 'react'

import { getNotificationBadges } from '@app/models/brand/get-notifications-badges'

import { initialNotificationBadges } from './initialValues'

import { NotificationBadgesContext } from './index'

export function NotificationBadgesContextProvider({
  brandId,
  children
}: PropsWithChildren<{ brandId: Nullable<UUID> }>) {
  const [badges, setBadges] = useState(initialNotificationBadges)

  const loadNotificationBadges = useCallback(async () => {
    if (brandId) {
      const response = await getNotificationBadges(brandId)

      setBadges(response)
    }
  }, [brandId])

  useEffect(() => {
    if (brandId) {
      loadNotificationBadges()
    }
  }, [brandId, loadNotificationBadges])

  const resetAllBadges = () => {
    setBadges(initialNotificationBadges)
  }

  const increaseBadge = (type: keyof INotificationBadges) => {
    setBadges(oldBadge => ({
      ...oldBadge,
      [type]: oldBadge[type] + 1
    }))
  }

  const decreaseBadge = (type: keyof INotificationBadges) => {
    setBadges(oldBadge => ({
      ...oldBadge,
      [type]: Math.max(oldBadge[type] - 1, 0)
    }))
  }

  const setBadge = (type: keyof INotificationBadges, value: number) => {
    setBadges(oldBadge => ({
      ...oldBadge,
      [type]: Math.max(value, 0)
    }))
  }

  return (
    <NotificationBadgesContext.Provider
      value={{
        badges,
        reload: loadNotificationBadges,
        resetAllBadges,
        increaseBadge,
        decreaseBadge,
        setBadge
      }}
    >
      {children}
    </NotificationBadgesContext.Provider>
  )
}
