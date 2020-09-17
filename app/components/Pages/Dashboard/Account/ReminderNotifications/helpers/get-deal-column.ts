import { dealDateObjectType } from '../constants'

import { ColumnState, ItemState } from '../types'

export function getDealColumn(
  dealContexts: readonly IDealBrandContext[] | undefined,
  settings: readonly ICalendarReminderNotificationSetting[]
): ColumnState {
  const filteredDealsContexts = dealContexts
    ? dealContexts.filter(context => context.data_type === 'Date')
    : []

  const items = filteredDealsContexts.map<ItemState>(context => {
    const eventType = context.key
    const setting = settings.find(
      ({ event_type, object_type }) =>
        event_type === eventType && object_type === dealDateObjectType
    )

    return {
      eventType,
      label: context.label,
      selected: !!setting,
      reminderSeconds: setting?.reminder ?? 0
    }
  })

  return {
    objectType: dealDateObjectType,
    title: 'Deals Critical Dates',
    items
  }
}
