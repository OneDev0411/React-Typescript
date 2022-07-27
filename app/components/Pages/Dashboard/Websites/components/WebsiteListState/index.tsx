import React from 'react'

import { Grid } from '@material-ui/core'

import WebsiteListStateEmpty from '../WebsiteListStateEmpty'
import WebsiteListStateLoading from '../WebsiteListStateLoading'

interface WebsiteListStateProps {
  title: string
  isLoading?: boolean
  isEmpty?: boolean
}

function WebsiteListState({
  title,
  isLoading = false,
  isEmpty = false
}: WebsiteListStateProps) {
  if (!isLoading && !isEmpty) {
    return null
  }

  return (
    <Grid item xs={12}>
      {isLoading ? (
        <WebsiteListStateLoading />
      ) : (
        <WebsiteListStateEmpty title={title} />
      )}
    </Grid>
  )
}

export default WebsiteListState
