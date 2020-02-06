import React, { useState } from 'react'

// import { MenuItem } from '@material-ui/core'

import { PageTabs, Tab } from 'components/PageTabs'

export const defaultFilter = {
  'object_types[]': [
    'contact',
    'contact_attribute',
    'crm_task',
    'email_campaign',
    'deal_context'
  ]
}

interface TabItem {
  label: string
  value: number
  filter: object
}

const TAB_ITEMS: TabItem[] = [
  {
    label: 'All Events',
    value: 0,
    filter: defaultFilter
  },
  {
    label: 'Touches',
    value: 2,
    filter: {
      'object_types[]': ['contact']
    }
  },
  {
    label: 'Calls',
    value: 1,
    filter: {
      'event_types[]': ['Call']
    }
  },
  {
    label: 'Celebrations',
    value: 3,
    filter: {
      'object_types[]': ['contact_attribute']
    }
  },
  {
    label: 'Critical Dates',
    value: 4,
    filter: {
      'object_types[]': ['deal_context']
    }
  },
  {
    label: 'Scheduled Emails',
    value: 5,
    filter: {
      'object_types[]': ['email_campaign']
    }
  }
]

export function Tabs() {
  const [selectedTab, setSelectedTab] = useState(TAB_ITEMS[0].value)

  return (
    <PageTabs
      defaultValue={selectedTab}
      tabs={TAB_ITEMS.map(({ label, value }, index: number) => (
        <Tab key={index} value={value} label={label} />
      ))}
    />
  )
}
