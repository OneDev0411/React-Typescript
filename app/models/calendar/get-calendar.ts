import Fetch from 'services/fetch'

export type CalendarObjectType =
  | 'crm_task' // Persoanl events added by agent
  | 'deal_context' // home anniversaries manually added by agent
  | 'contact_attribute' //  event_type = home_anniversary etc
  | 'contact' // aka. Touch reminders. event_type = next_touch
  | 'email_campaign'
  | 'email_thread_recipient'
  | 'crm_association'
  | 'email_campaign_recipient'

export interface FilterQuery {
  deal?: UUID
  contact?: UUID
  'event_types[]'?: string[]
  'object_types[]'?: CalendarObjectType[]
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
    const response = await new Fetch()
      .get('/calendar')
      .query({
        low: range[0],
        high: range[1],
        'associations[]': associations,
        'users[]': users
      })
      .query(filter)

    return response.body.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
