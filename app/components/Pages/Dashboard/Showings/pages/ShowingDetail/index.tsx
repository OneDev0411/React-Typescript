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
import ShowingDetailTabOverview from '../../components/ShowingDetailTabOverview'
import ShowingDetailTabBooking from '../../components/ShowingDetailTabBooking'
import ShowingDetailTabVisitors from '../../components/ShowingDetailTabVisitors'
import ShowingDetailTabSettings from '../../components/ShowingDetailTabSettings'
import ShowingDetailHeader from '../../components/ShowingDetailHeader'

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
  }, [run, showingId])

  console.log('showing', showing)

  const tab = params.tab || showingDetailTabs.Overview

  return (
    <PageLayout position="relative" overflow="hidden">
      <ShowingDetailHeader
        deal={showing?.deal}
        listing={showing?.listing}
        address={showing?.address}
      />
      {/* <PageLayout.Header>listing info</PageLayout.Header> */}
      <PageLayout.Main>
        <ShowingDetailTabs value={tab} id="12" />
        <Box my={3}>
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={showingDetailTabs.Overview}>
              <ShowingDetailTabOverview />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Booking}>
              <ShowingDetailTabBooking />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Visitors}>
              <ShowingDetailTabVisitors />
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
