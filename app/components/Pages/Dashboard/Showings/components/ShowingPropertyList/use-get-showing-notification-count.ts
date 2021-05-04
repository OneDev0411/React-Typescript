import { useMemo } from 'react'

type UseGetShowingNotificationCountReturn = Record<UUID, number>

function useGetShowingNotificationCount(
  showings: IShowing[]
): UseGetShowingNotificationCountReturn {
  return useMemo(
    () =>
      showings.reduce<UseGetShowingNotificationCountReturn>((acc, showing) => {
        return {
          ...acc,
          [showing.id]: (showing.appointments ?? []).reduce(
            (count, appointment) =>
              (appointment.notifications?.length || 0) + count,
            0
          )
        }
      }, {}),
    [showings]
  )
}

export default useGetShowingNotificationCount
