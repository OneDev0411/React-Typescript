import getShowings from './get-showings'

async function getShowingTotalNotificationCount(): Promise<number> {
  // TODO: implement this request
  const showings = await getShowings()

  return showings.reduce<number>(
    (totalCount, showing) =>
      totalCount +
      (showing.appointments?.reduce<number>(
        (count, appointment) =>
          count + (appointment.notifications?.length ?? 0),
        0
      ) ?? 0),
    0
  )
}

export default getShowingTotalNotificationCount
