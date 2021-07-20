import React from 'react'

import { Grid } from '@material-ui/core'

import WebsiteListStateEmpty from '../WebsiteListStateEmpty'
import WebsiteListStateLoading from '../WebsiteListStateLoading'

interface WebsiteListStateProps {
  isLoading?: boolean
  isEmpty?: boolean
}

function WebsiteListState({
  isLoading = false,
  isEmpty = false
}: WebsiteListStateProps) {
  if (!isLoading && !isEmpty) {
    return null
  }

  return (
    <Grid item xs={12}>
      {isLoading ? <WebsiteListStateLoading /> : <WebsiteListStateEmpty />}
    </Grid>
  )
}

export default WebsiteListState
