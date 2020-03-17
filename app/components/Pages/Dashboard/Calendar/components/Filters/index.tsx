import React from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { PageTabs, TabLink } from 'components/PageTabs'

const BASE_URL = '/dashboard/calendar/'

interface TabItem {
  label: string
  filter: object
  link: string
}

export const TAB_ITEMS: TabItem[] = [
  {
    label: 'All Events',
    filter: {
      'object_types[]': [
        'contact',
        'contact_attribute',
        'crm_task',
        'deal_context'
      ]
    },
    link: ''
  },
  {
    label: 'Touches',
    filter: {
      'object_types[]': ['contact']
    },
    link: 'touches'
  },
  {
    label: 'Celebrations',
    filter: {
      'object_types[]': ['contact_attribute']
    },
    link: 'celebrations'
  },
  {
    label: 'Critical Dates',
    filter: {
      'object_types[]': ['deal_context']
    },
    link: 'critical-dates'
  }
]

interface Props {
  onChange: (filter: object) => void
}

export const Filters = withRouter((props: Props & WithRouterProps) => {
  const handleChangeTab = (value: string) => {
    const item = TAB_ITEMS.find(({ link }) => link === value) || TAB_ITEMS[0]

    props.onChange(item.filter)
  }

  return (
    <PageTabs
      defaultValue={props.params.id || 'All'}
      onChange={handleChangeTab}
      tabs={TAB_ITEMS.map(({ label, link }, index: number) => {
        const url = `${BASE_URL}${link}`

        return (
          <TabLink key={index} value={link || 'All'} label={label} to={url} />
        )
      })}
    />
  )
})
