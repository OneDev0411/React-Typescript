import React from 'react'
import { Box } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { makeStyles } from '@material-ui/core/styles'

import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'

const useStyles = makeStyles(theme => ({
  listingContainer: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[200],
    width: 336,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}))

export default function GridView({ isFetching, sortedListings }) {
  const theme = useTheme()
  const classes = useStyles()

  const renderContent = () => {
    if (isFetching) {
      return <LoadingComponent />
    }

    return sortedListings.map(listing => (
      <Box key={listing.id} className={classes.listingContainer}>
        <ListingCard listing={listing} isShowOnMap />
      </Box>
    ))
  }

  return (
    <Box display="flex" flexWrap="wrap" p={theme.spacing(0, 1, 1)}>
      {renderContent()}
    </Box>
  )
}
