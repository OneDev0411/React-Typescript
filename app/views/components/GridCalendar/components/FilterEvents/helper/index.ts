/*
  this value provided from api doc. which is available in below.
  https://docs.rechat.com/testing/calendar.html#header-event-types
*/

export const CRM_OBJECT_TYPE = ['crm_task', 'crm_association']

// possible values for event_type of a celebration event
export const CELEBRATION_OBJECT_TYPE = 'contact_attribute'
export const CELEBRATION_EVENTS_TYPE = [
  'birthday',
  'child_birthday',
  'wedding_anniversary',
  'home_anniversary',
  'work_anniversary'
]

// possible values for event_type of a deal event
export const DEAL_OBJECT_TYPE = 'deal_context'
export const DEAL_EVENTS_TYPE = [
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
]
