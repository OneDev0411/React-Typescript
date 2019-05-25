import getCalendar from 'models/calendar/get-calendar'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

async function getCRMTimeline(query = {}, associations = []) {
  const [low, high] = [15, 25].map(
    y => new Date(`20${y}-01-01`).getTime() / 1000
  )

  const calenderAssociations = [
    'calendar_event.crm_task',
    'calendar_event.full_campaign',
    'calendar_event.full_crm_task'
  ]

  try {
    const calendarData = await getCalendar(
      low,
      high,
      [],
      {
        ...query,
        object_types: ['crm_association', 'email_campaign_recipient']
      },
      [
        ...CRM_TASKS_QUERY.associations,
        ...calenderAssociations,
        ...associations
      ]
    )

    return normalizeData(calendarData)
  } catch (error) {
    throw error
  }
}

function normalizeData(data) {
  return data
    .map(item => {
      let _item

      if (item.object_type === 'crm_association') {
        _item = item.full_crm_task
      } else if (item.object_type === 'email_campaign_recipient') {
        _item = {
          ...item.full_campaign,
          due_date: item.full_campaign.due_at
        }
      }

      return _item
    })
    .filter(Boolean)
}

export default getCRMTimeline
