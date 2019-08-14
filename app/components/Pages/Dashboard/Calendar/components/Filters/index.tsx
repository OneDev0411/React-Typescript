import React, { useState, ChangeEvent, useCallback } from 'react'
import { Tabs, Tab } from '@material-ui/core'

import { eventTypesIcons, EventTypeIcon } from 'views/utils/event-types-icons'
import { importantDatesIcons } from 'views/utils/important-dates-icons'

import { Container, TabTitle, TabItem } from './styled'

interface TabItem {
  label: string
  value: number
  Icon: EventTypeIcon | null
  filter: object
}

const TAB_ITEMS: TabItem[] = [
  {
    label: 'All Events',
    value: 0,
    Icon: null,
    filter: {}
  },
  {
    label: 'Touches',
    value: 2,
    Icon: eventTypesIcons.ListingAppointment,
    filter: {
      'object_types[]': ['contact']
    }
  },
  {
    label: 'Calls',
    value: 1,
    Icon: eventTypesIcons.Call,
    filter: {
      'event_types[]': ['Call']
    }
  },
  {
    label: 'Celebrations',
    value: 3,
    Icon: importantDatesIcons.Birthday,
    filter: {
      'object_types[]': ['contact_attribute']
    }
  },
  {
    label: 'Critical Dates',
    value: 4,
    Icon: eventTypesIcons['Task Critical'],
    filter: {
      'object_types[]': ['deal_context']
    }
  },
  {
    label: 'Scheduled Emails',
    value: 5,
    Icon: eventTypesIcons.Email,
    filter: {
      'object_types[]': ['email_campaign']
    }
  }
]

interface Props {
  onChange(filter: object): void
}

export function Filters({ onChange }: Props) {
  const [selectedTab, setSelectedTab] = useState(TAB_ITEMS[0].value)

  const handleFilterChange = useCallback(
    (e: ChangeEvent<{}>, value: number) => {
      setSelectedTab(value)

      const tab = TAB_ITEMS.find(tab => tab.value === value)

      if (tab) {
        onChange(tab.filter)
      }
    },
    [onChange]
  )

  return (
    <Container>
      <Tabs
        value={selectedTab}
        onChange={handleFilterChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {TAB_ITEMS.map(({ label, value, Icon }, index: number) => (
          <Tab
            key={index}
            value={value}
            label={
              <TabItem>
                {Icon && (
                  <Icon.icon
                    fill={selectedTab === index ? Icon.color : '#3c4b6e'}
                    style={{ width: '1.2rem' }}
                  />
                )}
                <TabTitle>{label}</TabTitle>
              </TabItem>
            }
          />
        ))}
      </Tabs>
    </Container>
  )
}
