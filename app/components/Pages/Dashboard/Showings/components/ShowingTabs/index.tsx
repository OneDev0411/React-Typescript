import React from 'react'

import { PageTabs, TabLink } from 'components/PageTabs'

import { showingTabs } from '../../constants'
import { ShowingTabType } from '../../types'

export interface ShowingTabsProps {
  type: ShowingTabType
}

const tabs = [
  <TabLink
    key={1}
    value={showingTabs.Overview}
    to="/dashboard/showings"
    label="Overview"
  />,
  <TabLink
    key={2}
    value={showingTabs.All}
    to={`/dashboard/showings/type/${showingTabs.All}`}
    label="All showings"
  />,
  <TabLink
    key={3}
    value={showingTabs.Offline}
    to={`/dashboard/showings/type/${showingTabs.Offline}`}
    label="Offline"
  />
]

function ShowingTabs({ type }: ShowingTabsProps) {
  return <PageTabs defaultValue={type} hasMegaMenu tabs={tabs} />
}

export default ShowingTabs
