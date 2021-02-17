import React from 'react'

import { Box, Link } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'
// import Stats from './Stats'

const useStyles = makeStyles(
  (theme: Theme) => ({
    exercises: {
      position: 'absolute',
      bottom: 25,
      right: 35,
      width: 190,
      height: 165,
      background: 'url(/static/images/overview/arrow.png) no-repeat',
      zIndex: 1
    },
    forceShowChecklist: {
      position: 'absolute',
      bottom: 20,
      right: 20
    }
  }),
  { name: 'Overview' }
)

function OverviewDashboard() {
  const classes = useStyles()

  return (
    <PageLayout>
      <PageLayout.Header title="Dashboard" />
      <PageLayout.Main>
        <Box className={classes.exercises}>
          <Box className={classes.forceShowChecklist}>
            {/* The following link is a direct call to show our appcuses checklist
            The id can be found in url while checklist is being edited.  */}
            <Link
              href="#"
              onClick={window.Appcues.show('-MTiikrxqIJB4mjqucN8')}
            >
              Show Exercises
            </Link>
          </Box>
        </Box>
        <Welcome />
        {/* <Box display="flex" mt={5} mb={5}>
          <Stats title="Production" value="$7,000,250" change={15} />
          <Stats title="Active Deals" value="8" change={20} />
          <Stats title="Pending Deals" value="2" change={-4} />
          <Stats title="Closed Deals" value="12" change={12} />
        </Box> */}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default OverviewDashboard
