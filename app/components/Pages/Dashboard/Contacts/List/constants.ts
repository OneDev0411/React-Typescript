export const SORT_FIELD_SETTING_KEY = 'grid_contacts_sort_field'

export const OPEN_HOUSE_FILTER_ID = 'openHouse'
export const FLOW_FILTER_ID = 'flow'

export const ORIGINS = [
  {
    label: 'Brokerage widget',
    description: 'Created from a brokerage widget',
    value: 'BrokerageWidget'
  },
  {
    label: 'Created by you',
    description: 'Created by you',
    value: 'ExplicitlyCreated'
  },
  {
    label: 'iOS Contact',
    description: 'From your address book',
    value: 'IOSAddressBook'
  },
  {
    label: 'Rechat Contact',
    description: 'Created because you share a room',
    value: 'SharesRoom'
  },
  {
    label: 'Outlook',
    description: 'Imported from outlook',
    value: 'External/Outlook'
  },
  {
    label: 'Open House',
    description: 'Created from an open house registration',
    value: 'OpenHouse'
  },
  {
    label: 'CSV',
    description: 'Imported from CSV',
    value: 'CSV'
  },
  {
    label: 'Google Contacts',
    description: 'Imported from Google Contacts',
    value: 'Google'
  }
]
