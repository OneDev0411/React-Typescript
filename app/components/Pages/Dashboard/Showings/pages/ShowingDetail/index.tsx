import { memo } from 'react'

import { useTitle } from 'react-use'

import { WithRouterProps } from 'react-router'

import { Box, useTheme } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import LoadingContainer from 'components/LoadingContainer'

import ShowingDetailTabs, { ShowingDetailTabsProps } from './ShowingDetailTabs'

import { showingDetailTabs } from '../../constants'
import ShowingDetailTabBookings from './ShowingDetailTabBookings'
import ShowingDetailTabVisitors from '../../components/ShowingDetailTabVisitors'
import ShowingDetailTabFeedback from '../../components/ShowingDetailTabFeedback'
import ShowingDetailTabSettings from '../../components/ShowingDetailTabSettings'
import ShowingDetailHeader from '../../components/ShowingDetailHeader'
import useBodyBackgroundColor from '../../hooks/use-body-background-color'
import useGetShowing from './use-get-showing'
import { getShowingImage } from '../../helpers'

type ShowingDetailProps = WithRouterProps<{
  tab?: ShowingDetailTabsProps['value']
  id: UUID
}>

function ShowingDetail({ params }: ShowingDetailProps) {
  useTitle('Showing Detail | Rechat')

  const theme = useTheme()

  useBodyBackgroundColor(theme.palette.grey[50])

  const showingId = params.id

  const { showing, isLoading, setShowing } = useGetShowing(showingId)

  const tab = params.tab || showingDetailTabs.Bookings

  return (
    <PageLayout position="relative" overflow="hidden" gutter={0}>
      <ShowingDetailHeader
        image={getShowingImage({
          deal: showing?.deal,
          listing: showing?.listing ?? null
        })}
        address={showing?.title || ''}
        mlsNumber={
          showing?.listing?.mls_number ||
          (showing?.deal?.listing as IListing)?.mls_number
        }
        bookingUrl={`/showings/${showing?.slug}-${showing?.human_readable_id}/book`}
      >
        <ShowingDetailTabs value={tab} id={showingId} />
      </ShowingDetailHeader>
      <PageLayout.Main mt={0} px={4} pb={4} pt={3}>
        {isLoading || !showing ? (
          <Box height="600px">
            <LoadingContainer
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 0
              }}
            />
          </Box>
        ) : (
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={showingDetailTabs.Bookings}>
              <ShowingDetailTabBookings
                appointments={showing.appointments ?? []}
                setShowing={setShowing}
              />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Visitors}>
              <ShowingDetailTabVisitors showingId={showingId} />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Feedback}>
              <ShowingDetailTabFeedback />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Settings}>
              <ShowingDetailTabSettings />
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingDetail)
