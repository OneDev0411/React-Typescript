import { memo, useEffect } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import { useTheme } from '@material-ui/core'

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
import useBodyBackgroundColor from '../../components/use-body-background-color'

type ShowingDetailProps = RouteComponentProps<
  {
    tab?: ShowingDetailTabsProps['value']
    id: UUID
  },
  {}
>

function ShowingDetail({ params }: ShowingDetailProps) {
  useTitle('Showing Detail | Rechat')

  const theme = useTheme()

  useBodyBackgroundColor(theme.palette.grey[50])

  const showingId = params.id

  const { data: showing, run, error } = useAsync<IShowing>()

  useEffect(() => {
    if (!error) {
      run(async () => getShowing(showingId))
    }
  }, [run, showingId, error])

  const tab = params.tab || showingDetailTabs.Bookings

  return (
    <PageLayout position="relative" overflow="hidden" gutter={0}>
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
        mlsNumber={
          showing?.listing?.mls_number ||
          (showing?.deal?.listing as IListing)?.mls_number
        }
        token={showing?.token}
      >
        <ShowingDetailTabs value={tab} id={showingId} />
      </ShowingDetailHeader>
      <PageLayout.Main mt={0} px={4} pb={4} pt={3}>
        <TabContentSwitch.Container value={tab}>
          <TabContentSwitch.Item value={showingDetailTabs.Bookings}>
            <ShowingDetailTabBookings appointments={showing?.appointments} />
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
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingDetail)
