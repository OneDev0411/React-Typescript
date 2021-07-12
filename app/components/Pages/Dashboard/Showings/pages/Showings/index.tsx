import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box } from '@material-ui/core'

import { WithRouterProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import LoadingContainer from 'components/LoadingContainer'

import { showingsTabs } from '../../constants'
import ShowingsTabProperties from './ShowingsTabProperties'
import ShowingsTabs, { ShowingsTabsProps } from './ShowingsTabs'
import ShowingsTabBookings from './ShowingsTabBookings'
import useGetShowings from './use-get-showings'

type ShowingsProps = WithRouterProps<{
  tab?: ShowingsTabsProps['value']
}>

function Showings({ params }: ShowingsProps) {
  useTitle('Showings | Rechat')

  const tab = params.tab || showingsTabs.Properties

  const { isLoading, showings, appointments, setShowings } = useGetShowings()

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Showings" />
      <PageLayout.Main>
        <Box mb={4}>
          <ShowingsTabs value={tab} />
        </Box>
        {isLoading ? (
          <LoadingContainer style={{ padding: '10% 0' }} />
        ) : (
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={showingsTabs.Properties}>
              <ShowingsTabProperties showings={showings} />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingsTabs.Bookings}>
              <ShowingsTabBookings
                appointments={appointments}
                setShowings={setShowings}
              />
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
