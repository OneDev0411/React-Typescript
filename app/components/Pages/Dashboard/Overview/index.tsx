import { makeStyles, Theme } from '@material-ui/core/styles'
import { Helmet } from 'react-helmet'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: { backgroundColor: theme.palette.background.default }
  }),
  { name: 'ThisWeeksSchedule' }
)

function OverviewDashboard() {
  const classes = useStyles()

  return (
    <>
      <Helmet>
        <title>Rechat | Today</title>
      </Helmet>
      <PageLayout className={classes.layout} padding={0}>
        <PageLayout.HeaderWithBackground title="Today" />
        <PageLayout.Main mt={0}>
          <Welcome />
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default OverviewDashboard
