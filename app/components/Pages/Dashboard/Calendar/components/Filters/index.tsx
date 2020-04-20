import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  RefObject
} from 'react'

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

export const DEFAULT_TAB = 'All'

export interface FiltersRef {
  changeFilter(tab: string): void
}

interface Props {
  filtersRef?: RefObject<FiltersRef>
  onChange: (filter: object) => void
}

const Filters = withRouter((props: Props & WithRouterProps) => {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)

  const handleChangeTab = (value: string) => {
    const item = TAB_ITEMS.find(({ link }) => link === value) || TAB_ITEMS[0]

    setActiveTab(value)
    props.onChange(item.filter)
  }

  useImperativeHandle(props.filtersRef, () => ({
    changeFilter: (tab: string) => handleChangeTab(tab)
  }))

  return (
    <PageTabs
      defaultValue={props.params.id || DEFAULT_TAB}
      value={activeTab}
      onChange={handleChangeTab}
      tabs={TAB_ITEMS.map(({ label, link }, index: number) => {
        const url = `${BASE_URL}${link}`

        return (
          <TabLink
            key={index}
            value={link || DEFAULT_TAB}
            label={label}
            to={url}
          />
        )
      })}
    />
  )
})

export default forwardRef((props: Props, ref: RefObject<FiltersRef>) => (
  <Filters {...props} filtersRef={ref} />
))
