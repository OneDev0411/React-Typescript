export const oneDayInSeconds = 86400
export const oneWeekInSeconds = 7 * oneDayInSeconds

export const dealDateObjectType = 'deal_context'
export const contactDateObjectType = 'contact_attribute'

export const objectTypes = [dealDateObjectType, contactDateObjectType] as const

export const homeAnniversaryEventType = 'home_anniversary'

export const renderForcePushButton = false

// /////////////////////////////

export const API_URL = '/calendar/settings/notifications'
export const FORCE_PUSH_API_URL = `${API_URL}/force`

export const DEAL_DATE_OBJECT_TYPE = 'deal_context'
export const CONTACT_DATE_OBJECT_TYPE = 'contact_attribute'

export const DROPDOWN_OPTIONS = [
  {
    label: 'Day of',
    value: 0
  },
  {
    label: '1 day before',
    value: 86400
  },
  {
    label: '2 days before',
    value: 172800
  },
  {
    label: '3 days before',
    value: 259200
  },
  {
    label: '1 week before',
    value: 604800
  },
  {
    label: '2 weeks before',
    value: 1209600
  }
]
