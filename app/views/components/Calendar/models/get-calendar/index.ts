import Fetch from 'services/fetch'

type CalendarObjectType =
  | 'crm_task'
  | 'deal_context'
  | 'contact_attribute'
  | 'contact'
  | 'email_campaign'

export interface FilterQuery {
  deal?: UUID
  contact?: UUID
  event_types?: string[]
  object_types?: CalendarObjectType
}

interface ApiOptions {
  range: NumberRange
  filter?: FilterQuery
  associations?: string[]
  users?: UUID[]
}

export async function getCalendar(options: ApiOptions) {
  const { range, filter = {}, associations = [], users = [] } = options

  try {
    const response = await new Fetch().get('/calendar').query({
      low: range[0],
      high: range[1],
      'associations[]': [
        'crm_task.associations',
        'crm_task.assignees',
        'calendar_event.full_crm_task',
        'crm_association.contact',
        'calendar_event.full_contact',
        ...associations
      ],
      'users[]': users,
      ...filter
    })

    return response.body.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
