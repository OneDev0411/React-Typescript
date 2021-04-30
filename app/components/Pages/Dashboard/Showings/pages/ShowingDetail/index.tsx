import { memo, useEffect } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import { Box, useTheme } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import useAsync from 'hooks/use-async'

import getShowing from 'models/showing/get-showing'

import LoadingContainer from 'components/LoadingContainer'

import ShowingDetailTabs, {
  ShowingDetailTabsProps
} from '../../components/ShowingDetailTabs'

import { showingDetailTabs } from '../../constants'
import ShowingDetailProvider from '../../components/ShowingDetailProvider'
import ShowingDetailTabBookings from '../../components/ShowingDetailTabBookings'
import ShowingDetailTabVisitors from '../../components/ShowingDetailTabVisitors'
import ShowingDetailTabFeedback from '../../components/ShowingDetailTabFeedback'
import ShowingDetailTabSettings from '../../components/ShowingDetailTabSettings'
import ShowingDetailHeader from '../../components/ShowingDetailHeader'
import useShowingImage from '../../hooks/use-showing-image'
import useShowingAddress from '../../hooks/use-showing-address'
import useBodyBackgroundColor from '../../hooks/use-body-background-color'
import useCheckApprovalAccess from './use-check-approval-access'

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

  const { data: showing, run, error, isLoading, setData } = useAsync<IShowing>()

  useEffect(() => {
    if (!error) {
      run(async () => getShowing(showingId))
    }
  }, [run, showingId, error])

  const tab = params.tab || showingDetailTabs.Bookings

  const hasApprovalAccess = useCheckApprovalAccess(showing?.roles)

  console.log('showing', showing)

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
          <ShowingDetailProvider
            id={showingId}
            setData={setData}
            hasApprovalAccess={hasApprovalAccess}
          >
            <TabContentSwitch.Container value={tab}>
              <TabContentSwitch.Item value={showingDetailTabs.Bookings}>
                <ShowingDetailTabBookings
                  appointments={showing.appointments ?? []}
                  duration={showing.duration}
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
          </ShowingDetailProvider>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingDetail)
