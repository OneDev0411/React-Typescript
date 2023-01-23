import { PropsWithChildren, useState, useEffect, useCallback } from 'react'

import { getNotificationsBadges } from '@app/models/brand/get-notifications-badges'

import { initialBadges } from './initialValues'

import { NotificationsBadgesContext } from './index'

export function NotificationsBadgesContextProvider({
  brandId,
  children
}: PropsWithChildren<{ brandId: Nullable<UUID> }>) {
  const [badges, setBadges] = useState(initialBadges)

  const loadNotificationsBadges = useCallback(async () => {
    if (brandId) {
      const response = await getNotificationsBadges(brandId)

      setBadges(response)
    }
  }, [brandId])

  useEffect(() => {
    if (brandId) {
      loadNotificationsBadges()
    }
  }, [brandId, loadNotificationsBadges])

  const resetAllBadges = () => {
    setBadges(initialBadges)
  }

  const increaseBadge = (type: keyof INotificationsBadges) => {
    setBadges(oldBadges => ({
      ...oldBadges,
      [type]: oldBadges[type] + 1
    }))
  }

  const decreaseBadge = (type: keyof INotificationsBadges) => {
    setBadges(oldBadges => ({
      ...oldBadges,
      [type]: Math.max(oldBadges[type] - 1, 0)
    }))
  }

  const setBadge = (type: keyof INotificationsBadges, value: number) => {
    setBadges(oldBadges => ({
      ...oldBadges,
      [type]: Math.max(value, 0)
    }))
  }

  return (
    <NotificationsBadgesContext.Provider
      value={{
        badges,
        reload: loadNotificationsBadges,
        resetAllBadges,
        increaseBadge,
        decreaseBadge,
        setBadge
      }}
    >
      {children}
    </NotificationsBadgesContext.Provider>
  )
}
