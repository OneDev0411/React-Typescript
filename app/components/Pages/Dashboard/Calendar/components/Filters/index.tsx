import React, { useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Flex from 'styled-flex-component'

import { eventTypesIcons, EventTypeIcon } from 'views/utils/event-types-icons'
import { importantDatesIcons } from 'views/utils/important-dates-icons'

interface TabItem {
  label: string
  value: number
  Icon: EventTypeIcon | null
}

const TAB_ITEMS: TabItem[] = [
  { label: 'All Events', value: 0, Icon: null },
  { label: 'Calls', value: 1, Icon: eventTypesIcons.Call },
  { label: 'Touches', value: 2, Icon: eventTypesIcons.ListingAppointment },
  { label: 'Celebrations', value: 3, Icon: importantDatesIcons.Birthday },
  { label: 'Critical Dates', value: 4, Icon: eventTypesIcons['Task Critical'] },
  { label: 'Scheduled Emails', value: 5, Icon: eventTypesIcons.Email }
]

interface Props {}

export function Filters(props: Props) {
  const [selectedTab, setSelectedTab] = useState(TAB_ITEMS[0].value)

  return (
    <div
      style={{
        width: '85%'
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={(e, value) => setSelectedTab(value)}
        indicatorColor="primary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {TAB_ITEMS.map(({ label, value, Icon }, index: number) => (
          <Tab
            key={index}
            value={value}
            label={
              <Flex alignCenter>
                {Icon && (
                  <Icon.icon
                    fill="#3c4b6e"
                    style={{ marginRight: '0.5rem', width: '1.2rem' }}
                  />
                )}
                {label}
              </Flex>
            }
          />
        ))}
      </Tabs>
    </div>
  )
}
