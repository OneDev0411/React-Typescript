import React from 'react'

import { Grid } from '@material-ui/core'

import WebsiteListStateLoading from '../WebsiteListStateLoading'
import WebsiteListStateEmpty from '../WebsiteListStateEmpty'

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
