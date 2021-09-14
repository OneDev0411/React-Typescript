import { useMemo } from 'react'

type UseGetShowingNotificationCountReturn = Record<UUID, number>

function useGetShowingNotificationCount(
  showings: IShowing<'showing'>[]
): UseGetShowingNotificationCountReturn {
  return useMemo(
    () =>
      showings.reduce<UseGetShowingNotificationCountReturn>((acc, showing) => {
        return {
          ...acc,
          [showing.id]: (showing.appointments ?? []).reduce(
            (count, appointment) =>
              count + (appointment.notifications?.length ? 1 : 0),
            0
          )
        }
      }, {}),
    [showings]
  )
}

export default useGetShowingNotificationCount
