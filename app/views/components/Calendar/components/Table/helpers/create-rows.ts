export function createRows(events: CalendarEventsList) {
  const rows: any = []

  Object.entries(events).forEach(([day, events]) => {
    rows.push({
      is_header: true,
      title: day
    })

    rows.push(...events)
  })

  return rows
}
