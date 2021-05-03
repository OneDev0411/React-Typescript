import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box, useTheme, makeStyles } from '@material-ui/core'

import { WithRouterProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import { showingsTabs } from '../../constants'
import useBodyBackgroundColor from '../../hooks/use-body-background-color'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'
import ShowingsTabProperties from './ShowingsTabProperties'
import ShowingsTabs, { ShowingsTabsProps } from './ShowingsTabs'
import ShowingsTabBookings from './ShowingsTabBookings'
import useGetShowings from './use-get-showings'

const useStyles = makeStyles(
  theme => ({
    header: { backgroundColor: theme.palette.common.white }
  }),
  { name: 'Showings' }
)

type ShowingsProps = WithRouterProps<{
  tab?: ShowingsTabsProps['value']
}>

function Showings({ params }: ShowingsProps) {
  const theme = useTheme()
  const classes = useStyles()

  useTitle('Showings | Rechat')

  useBodyBackgroundColor(theme.palette.grey[50])

  const tab = params.tab || showingsTabs.Properties

  const {
    isLoading,
    showings,
    appointments: allAppointments,
    setShowings
  } = useGetShowings()

  const {
    appointments,
    notifications,
    unseenAppointmentNotificationIds
  } = useAppointmentNotificationLists(allAppointments)

  return (
    <PageLayout position="relative" overflow="hidden" gutter={0}>
      <Box className={classes.header} px={4} pt={4}>
        <PageLayout.Header title="Showings" />
        <Box mt={4}>
          <ShowingsTabs value={tab} />
        </Box>
      </Box>
      <PageLayout.Main mt={0} px={4} pb={4} pt={4}>
        <TabContentSwitch.Container value={tab}>
          <TabContentSwitch.Item value={showingsTabs.Properties}>
            <ShowingsTabProperties
              isLoading={isLoading}
              showings={showings}
              appointments={appointments}
              notifications={notifications}
            />
          </TabContentSwitch.Item>
          <TabContentSwitch.Item value={showingsTabs.Bookings}>
            <ShowingsTabBookings
              isLoading={isLoading}
              appointments={appointments}
              notifications={notifications}
              unseenAppointmentNotificationIds={
                unseenAppointmentNotificationIds
              }
              setShowings={setShowings}
            />
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
