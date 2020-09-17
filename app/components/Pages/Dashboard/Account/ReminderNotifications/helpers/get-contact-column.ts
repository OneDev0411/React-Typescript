import {
  IAttributeDefsState,
  selectDefsBySection
} from 'reducers/contacts/attributeDefs'

import { contactDateObjectType } from '../constants'

import { ColumnState, ItemState } from '../types'

export function getContactColumn(
  contactsAttributeDefs: IAttributeDefsState,
  settings: readonly ICalendarReminderNotificationSetting[]
): ColumnState {
  const items = selectDefsBySection(contactsAttributeDefs, 'Dates').map<
    ItemState
  >(def => {
    const eventType = def.name || def.label
    const setting = settings.find(
      ({ event_type, object_type }) =>
        event_type === eventType && object_type === contactDateObjectType
    )

    return {
      eventType,
      label: def.label,
      selected: !!setting,
      reminderSeconds: setting?.reminder ?? 0
    }
  })

  return {
    objectType: contactDateObjectType,
    title: 'Contact Dates',
    items
  }
}
