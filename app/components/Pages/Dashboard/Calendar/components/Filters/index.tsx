import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

interface Props {}

const TAB_ITEMS = [
  { label: 'All Events', value: 0, icon: '' },
  { label: 'Calls', value: 1, icon: '' },
  { label: 'Touches', value: 2, icon: '' },
  { label: 'Celebrations', value: 3, icon: '' },
  { label: 'Critical Dates', value: 4, icon: '' },
  { label: 'Scheduled Emails', value: 5, icon: '' }
]

export function Filters(props: Props) {
  return (
    <div
      style={{
        width: '85%'
      }}
    >
      <Tabs
        value={1}
        onChange={console.log}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {TAB_ITEMS.map((item, index) => (
          <Tab key={index} label={item.label} />
        ))}
      </Tabs>
    </div>
  )
}
