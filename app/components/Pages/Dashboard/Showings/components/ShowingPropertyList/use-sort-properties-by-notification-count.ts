import { useMemo } from 'react'

function useSortPropertiesByNotificationCount(
  showings: IShowing<'showing'>[],
  showingNotificationCount: Record<UUID, number>
): IShowing<'showing'>[] {
  return useMemo<IShowing<'showing'>[]>(
    () =>
      [...showings].sort((a, b) => {
        if (showingNotificationCount[a.id] > showingNotificationCount[b.id]) {
          return -1
        }

        if (showingNotificationCount[a.id] < showingNotificationCount[b.id]) {
          return 1
        }

        return 0
      }),
    [showings, showingNotificationCount]
  )
}

export default useSortPropertiesByNotificationCount
