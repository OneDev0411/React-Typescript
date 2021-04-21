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
import useBackgroundColor from '../../components/use-background-color'

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

  useBackgroundColor(theme.palette.grey[50])

  const tab = params.tab || showingsTabs.Properties

  return (
    <PageLayout position="relative" overflow="hidden" gutter={0}>
      <Box className={classes.header} px={4} pt={4}>
        <PageLayout.Header title="Showings" />
        <Box mt={5}>
          <ShowingsTabs value={tab} />
        </Box>
      </Box>
      <PageLayout.Main mt={0} px={4} pb={4}>
        <TabContentSwitch.Container value={tab}>
          <TabContentSwitch.Item value={showingsTabs.Properties}>
            <ShowingsTabProperties />
          </TabContentSwitch.Item>
          <TabContentSwitch.Item value={showingsTabs.Properties}>
            <ShowingsTabBookings />
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
