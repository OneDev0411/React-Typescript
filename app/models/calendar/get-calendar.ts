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
  range?: Partial<ICalendarRange>
  filter?: FilterQuery
  associations?: string[]
  users?: UUID[]
  limit?: number
}

export async function getCalendar(options: ApiOptions) {
  const {
    limit,
    range = {},
    filter = {},
    associations = [],
    users = []
  } = options
  const { low, high } = range

  try {
    const response = await new Fetch()
      .get('/calendar')
      .query({
        limit,
        low,
        high,
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
