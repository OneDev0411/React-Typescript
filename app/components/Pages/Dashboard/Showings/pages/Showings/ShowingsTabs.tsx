import { PageTabs, TabLink } from 'components/PageTabs'

import { showingsTabs } from '../../constants'
import { ShowingsTabType } from '../../types'

export interface ShowingsTabsProps {
  value: ShowingsTabType
}

function ShowingsTabs({ value }: ShowingsTabsProps) {
  const tabs = [
    <TabLink
      key={1}
      value={showingsTabs.Properties}
      to={`/dashboard/showings/${showingsTabs.Properties}`}
      label="Properties"
    />,
    <TabLink
      key={2}
      value={showingsTabs.Bookings}
      to={`/dashboard/showings/${showingsTabs.Bookings}`}
      label="Bookings"
    />
  ]

  return <PageTabs defaultValue={value} tabs={tabs} />
}

export default ShowingsTabs
