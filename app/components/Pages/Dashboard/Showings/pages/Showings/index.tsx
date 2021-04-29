import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box, useTheme, makeStyles } from '@material-ui/core'

import { RouteComponentProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import ShowingsTabs, { ShowingsTabsProps } from '../../components/ShowingsTabs'
import { showingsTabs } from '../../constants'
import ShowingsTabProperties from '../../components/ShowingsTabProperties'
import ShowingsTabBookings from '../../components/ShowingsTabBookings'
import useBodyBackgroundColor from '../../components/use-body-background-color'
import useGetShowings from './use-get-showings'

const useStyles = makeStyles(
  theme => ({
    header: { backgroundColor: theme.palette.common.white }
  }),
  { name: 'Showings' }
)

type ShowingsProps = RouteComponentProps<
  {
    tab?: ShowingsTabsProps['value']
  },
  {}
>

function Showings({ params }: ShowingsProps) {
  const theme = useTheme()
  const classes = useStyles()

  useTitle('Showings | Rechat')

  useBodyBackgroundColor(theme.palette.grey[50])

  const tab = params.tab || showingsTabs.Properties

  const { isLoading, showings, appointments } = useGetShowings()

  return (
    <PageLayout position="relative" overflow="hidden" gutter={0}>
      <Box className={classes.header} px={4} pt={4}>
        <PageLayout.Header title="Showings" />
        <Box mt={4}>
          <ShowingsTabs value={tab} />
        </Box>
      </Box>
      <PageLayout.Main mt={0} px={4} pb={4}>
        <TabContentSwitch.Container value={tab}>
          <TabContentSwitch.Item value={showingsTabs.Properties}>
            <ShowingsTabProperties
              isLoading={isLoading}
              showings={showings}
              appointments={appointments}
            />
          </TabContentSwitch.Item>
          <TabContentSwitch.Item value={showingsTabs.Bookings}>
            <ShowingsTabBookings />
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
