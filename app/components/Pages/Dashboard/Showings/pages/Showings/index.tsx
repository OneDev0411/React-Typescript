import { memo, useState } from 'react'

import { Box } from '@material-ui/core'
import { WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import NoSearchResults from '@app/components/Partials/no-search-results'
import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import TabContentSwitch from 'components/TabContentSwitch'

import { showingsTabs } from '../../constants'

import ShowingsTabBookings from './ShowingsTabBookings'
import ShowingsTabProperties from './ShowingsTabProperties'
import ShowingsTabs, { ShowingsTabsProps } from './ShowingsTabs'
import useGetShowings from './use-get-showings'

type ShowingsProps = WithRouterProps<{
  tab?: ShowingsTabsProps['value']
}>

function Showings({ params }: ShowingsProps) {
  useTitle('Showings | Rechat')

  const tab = params.tab || showingsTabs.Properties

  const [query, setQuery] = useState<string>('')

  const { isLoading, showings, appointments, setShowings } =
    useGetShowings(query)

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.HeaderWithSearch
        title="Showings"
        onSearch={setQuery}
        SearchInputProps={{
          placeholder: 'Search Address, MLS# or Agent',
          isLoading: !!query && isLoading
        }}
      />
      <PageLayout.Main>
        <Box mb={4}>
          <ShowingsTabs value={tab} />
        </Box>
        {isLoading ? (
          <LoadingContainer style={{ padding: '10% 0' }} />
        ) : (
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={showingsTabs.Properties}>
              {query && showings?.length === 0 ? (
                <NoSearchResults description="Try typing another address, MLS# or agent." />
              ) : (
                <ShowingsTabProperties showings={showings} />
              )}
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingsTabs.Bookings}>
              {query && appointments?.length === 0 ? (
                <NoSearchResults description="Try typing another address, MLS# or agent." />
              ) : (
                <ShowingsTabBookings
                  appointments={appointments}
                  setShowings={setShowings}
                />
              )}
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
