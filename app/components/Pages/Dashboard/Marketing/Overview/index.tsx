import { Box, Grid } from '@material-ui/core'
import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'
import LoadingContainer from 'components/LoadingContainer'

import Layout from '..'

import Sections from './Sections'

function MarketingOverview() {
  useTitle('Marketing | Rechat')

  return (
    <Layout
      render={({ isLoading }) => {
        if (isLoading) {
          return <LoadingContainer noPaddings />
        }

        return (
          <Box py={3}>
            <Grid container>
              <Sections />
            </Grid>
          </Box>
        )
      }}
    />
  )
}

export default withRouter(MarketingOverview)
