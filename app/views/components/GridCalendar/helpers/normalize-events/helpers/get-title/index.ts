/**
 * get the event title
 * @param event
 */
export const getTitle = (event: ICalendarEvent): string => {
  const { title, object_type, event_type } = event

  if (
    object_type === 'contact' &&
    event_type === 'next_touch' &&
    event.people
  ) {
    const contact = event.people[0] as IContact

    return `Touch Reminder: ${contact.display_name}`
  }

  if (event_type === 'home_anniversary') {
    return `Closing: ${title}`
  }

  if (!title) {
    return `[No Title ${event_type}]`
  }

  return title
}
