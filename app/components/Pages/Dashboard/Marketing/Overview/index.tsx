import React from 'react'
import { useTitle } from 'react-use'
import { Box, Grid } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'

import Layout from '..'
import Sections from './Sections'

export default function MarketingOverview() {
  useTitle('Marketing | Rechat')

  return (
    <Layout
      render={({ items, isLoading, types, medium, onDeleteTemplate }) => {
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
