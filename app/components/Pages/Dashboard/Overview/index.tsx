import { makeStyles, Theme } from '@material-ui/core/styles'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: { backgroundColor: theme.palette.background.default }
  }),
  { name: 'ThisWeeksSchedule' }
)

function OverviewDashboard() {
  useTitle('Rechat | Today')

  const classes = useStyles()

  return (
    <PageLayout className={classes.layout}>
      <PageLayout.Header title="Today" />
      <PageLayout.Main mt={0}>
        <Welcome />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default OverviewDashboard
