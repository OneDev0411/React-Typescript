import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box } from '@material-ui/core'

import { RouteComponentProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import ShowingsTabs, { ShowingsTabsProps } from '../../components/ShowingsTabs'
import { showingsTabs } from '../../constants'
import ShowingsTabProperties from '../../components/ShowingsTabProperties'
import ShowingsTabBookings from '../../components/ShowingsTabBookings'

type ShowingsProps = RouteComponentProps<
  {
    tab?: ShowingsTabsProps['value']
  },
  {}
>

function Showings({ params }: ShowingsProps) {
  useTitle('Showings | Rechat')

  const tab = params.tab || showingsTabs.Properties

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Showings" />
      <PageLayout.Main>
        <Box my={3}>
          <ShowingsTabs value={tab} />
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={showingsTabs.Properties}>
              <ShowingsTabProperties />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingsTabs.Properties}>
              <ShowingsTabBookings />
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
