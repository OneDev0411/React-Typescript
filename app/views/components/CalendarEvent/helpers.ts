export function getEventMarketingTemplateTypes(
  event: ICalendarEvent
): IMarketingTemplateType[] | null {
  if (event.event_type === 'birthday') {
    return ['Birthday']
  }

  if (event.event_type === 'child_birthday') {
    return ['Birthday']
  }

  if (event.event_type === 'wedding_anniversary') {
    return ['WeddingAnniversary']
  }

  if (event.event_type === 'home_anniversary') {
    return ['HomeAnniversary']
  }

  return null
}
