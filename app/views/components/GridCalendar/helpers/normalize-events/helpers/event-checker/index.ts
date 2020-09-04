/**
 * check the event is related to a deal
 * @param event
 */
export const isDealEvent = (event: ICalendarEvent): boolean => {
  return (
    event?.object_type === 'deal_context' &&
    [
      'list_date',
      'expiration_date',
      'contract_date',
      'inspection_date',
      'option_period',
      'financing_due',
      'title_due',
      't47_due',
      'closing_date',
      'possession_date',
      'lease_executed',
      'lease_application_date',
      'lease_begin',
      'lease_end'
    ].includes(event?.event_type)
  )
}
/**
 * check the event is a celebration event
 * @param event
 */
export const isCelebrationEvent = (event: ICalendarEvent): boolean => {
  return [
    'birthday',
    'child_birthday',
    'wedding_anniversary',
    'work_anniversary',
    'home_anniversary'
  ].includes(event?.event_type)
}

/**
 * check the event is a CRM event
 * @param event
 */
export const isCRMEvent = (event: ICalendarEvent): boolean => {
  return ['crm_task', 'crm_association'].includes(event.object_type)
}
