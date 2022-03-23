import { memo } from 'react'

import { Box } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import TabContentSwitch from 'components/TabContentSwitch'

import ShowingDetailHeader from '../../components/ShowingDetailHeader'
import ShowingDetailTabSettings from '../../components/ShowingDetailTabSettings'
import ShowingDetailTabVisitors from '../../components/ShowingDetailTabVisitors'
import { showingDetailTabs } from '../../constants'
import { getShowingBookingPageUrl, getShowingImage } from '../../helpers'

import ShowingDetailLayout from './ShowingDetailLayout'
import ShowingDetailTabBookings from './ShowingDetailTabBookings'
import ShowingDetailTabs, { ShowingDetailTabsProps } from './ShowingDetailTabs'
import useGetShowing from './use-get-showing'

type ShowingDetailProps = RouteComponentProps<
  {
    tab?: ShowingDetailTabsProps['value']
    id: UUID
  },
  {} // Used this empty type because if you pass `any` it ruins the params type
>

const defaultAppointments: IShowingAppointment<'showing'>[] = []

function ShowingDetail({
  params,
  route,
  router,
  location
}: ShowingDetailProps) {
  useTitle('Showing Detail | Rechat')

  const showingId = params.id

  const { showing, isLoading, setShowing } = useGetShowing(showingId)

  const tab = params.tab || showingDetailTabs.Bookings

  const showingBookingUrl = showing ? getShowingBookingPageUrl(showing) : ''

  return (
    <PageLayout position="relative" overflow="hidden" gutter={0}>
      <ShowingDetailHeader
        image={getShowingImage({
          deal: showing?.deal,
          listing: showing?.listing ?? null
        })}
        address={showing?.title || ''}
        listing={showing?.listing || showing?.deal?.listing}
        bookingUrl={showingBookingUrl}
        roles={showing?.roles}
      />
      <PageLayout.Main gutter={0} mt={0} mr={4}>
        <Box ml={4}>
          <ShowingDetailTabs value={tab} id={showingId} />
        </Box>
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
              <ShowingDetailLayout>
                <ShowingDetailTabBookings
                  appointments={showing.appointments ?? defaultAppointments}
                  setShowing={setShowing}
                  showingBookingUrl={showingBookingUrl}
                />
              </ShowingDetailLayout>
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Visitors}>
              <ShowingDetailLayout>
                <ShowingDetailTabVisitors
                  showing={showing}
                  appointments={showing.appointments ?? defaultAppointments}
                  showingBookingUrl={showingBookingUrl}
                />
              </ShowingDetailLayout>
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Settings}>
              <ShowingDetailTabSettings
                showing={showing}
                setShowing={setShowing}
                route={route}
                router={router}
                location={location}
              />
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingDetail)
