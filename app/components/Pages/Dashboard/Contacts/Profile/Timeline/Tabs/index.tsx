import React from 'react'

import { PageTabs, Tab } from 'components/PageTabs'

export enum Filters {
  Events = 0,
  Notes = 1
}

interface Props {
  onChangeFilter(value: number): void
}

export function TabsFilter(props: Props) {
  return (
    <PageTabs
      defaultValue={Filters.Events}
      onChange={props.onChangeFilter}
      tabs={[
        <Tab key={0} value={Filters.Events} label="Events" />,
        <Tab key={1} value={Filters.Notes} label="Notes" />
      ]}
    />
  )
}
