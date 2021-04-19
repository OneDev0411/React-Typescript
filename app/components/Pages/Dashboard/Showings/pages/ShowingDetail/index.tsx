import { memo, useEffect } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import useAsync from 'hooks/use-async'

import getShowing from 'models/showing/get-showing'

import ShowingDetailTabs, {
  ShowingDetailTabsProps
} from '../../components/ShowingDetailTabs'

import { showingDetailTabs } from '../../constants'
import ShowingDetailTabBookings from '../../components/ShowingDetailTabBookings'
import ShowingDetailTabVisitors from '../../components/ShowingDetailTabVisitors'
import ShowingDetailTabFeedback from '../../components/ShowingDetailTabFeedback'
import ShowingDetailTabSettings from '../../components/ShowingDetailTabSettings'
import ShowingDetailHeader from '../../components/ShowingDetailHeader'
import useShowingImage from '../../components/use-showing-image'
import useShowingAddress from '../../components/use-showing-address'

type ShowingDetailProps = RouteComponentProps<
  {
    tab?: ShowingDetailTabsProps['value']
    id: UUID
  },
  {}
>

function ShowingDetail({ params }: ShowingDetailProps) {
  useTitle('Showing Detail | Rechat')

  const showingId = params.id

  const { data: showing, run, error } = useAsync<IShowing>()

  useEffect(() => {
    if (!error) {
      run(async () => getShowing(showingId))
    }
  }, [run, showingId, error])

  console.log('showing', showing)

  const tab = params.tab || showingDetailTabs.Bookings

  return (
    <PageLayout position="relative" overflow="hidden">
      <ShowingDetailHeader
        image={useShowingImage({
          deal: showing?.deal,
          listing: showing?.listing
        })}
        address={useShowingAddress({
          deal: showing?.deal,
          listing: showing?.listing,
          address: showing?.address
        })}
        link={
          showing?.id
            ? `https://rechat.com/dashboard/showings/${showing.id}/detail`
            : ''
        }
      />
      {/* <PageLayout.Header>listing info</PageLayout.Header> */}
      <PageLayout.Main>
        <ShowingDetailTabs value={tab} id={showingId} />
        <Box my={3}>
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={showingDetailTabs.Bookings}>
              <ShowingDetailTabBookings />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Visitors}>
              <ShowingDetailTabVisitors />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Feedback}>
              <ShowingDetailTabFeedback />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Settings}>
              <ShowingDetailTabSettings />
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingDetail)
