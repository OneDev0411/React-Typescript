import React from 'react'

import { PageTabs, TabLink } from 'components/PageTabs'

import { showingDetailTabs } from '../../constants'
import { ShowingDetailTabType } from '../../types'

export interface ShowingDetailTabsProps {
  value: ShowingDetailTabType
  id: UUID
}

function ShowingDetailTabs({ value, id }: ShowingDetailTabsProps) {
  const tabs = [
    <TabLink
      key={1}
      value={showingDetailTabs.Overview}
      to={`/dashboard/showings/${id}/detail`}
      label="Overview"
    />,
    <TabLink
      key={2}
      value={showingDetailTabs.Booking}
      to={`/dashboard/showings/${id}/detail/${showingDetailTabs.Booking}`}
      label="Booking"
    />,
    <TabLink
      key={3}
      value={showingDetailTabs.Visitors}
      to={`/dashboard/showings/${id}/detail/${showingDetailTabs.Visitors}`}
      label="Visitors"
    />,
    <TabLink
      key={4}
      value={showingDetailTabs.Settings}
      to={`/dashboard/showings/${id}/detail/${showingDetailTabs.Settings}`}
      label="Settings"
    />
  ]

  return <PageTabs defaultValue={value} hasMegaMenu tabs={tabs} />
}

export default ShowingDetailTabs
