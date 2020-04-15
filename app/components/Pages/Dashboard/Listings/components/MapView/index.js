import React from 'react'
import cn from 'classnames'
import { makeStyles, Box, Grid } from '@material-ui/core'

import LoadingComponent from 'components/Spinner'

import ListingCard from '../ListingCard'

const CARDS_CONTAINER_WIDTH = '27em'
const VERTICAL_GAP_FROM_PAGE_TOP = '12em' // It's the page header height

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      overflow: 'hidden',
      height: `calc(100vh - ${VERTICAL_GAP_FROM_PAGE_TOP})`
    },
    mapContainer: {
      width: `calc(100% - ${CARDS_CONTAINER_WIDTH})`,
      height: '100%',
      position: 'relative'
    },
    cardsContainer: {
      width: `${CARDS_CONTAINER_WIDTH}`,
      padding: theme.spacing(0, 0.5, 2, 2),
      overflowY: 'scroll',
      borderLeft: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'MapView' }
)

const MapView = props => {
  const classes = useStyles()
  const renderCards = () => {
    if (props.isFetching) {
      return <LoadingComponent />
    }

    return props.sortedListings.map(listing => (
      <Grid key={listing.id} item xs={12}>
        <ListingCard
          listing={listing}
          tabName={props.tabName}
          user={props.user}
        />
      </Grid>
    ))
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.mapContainer}>{props.Map}</Box>
      <Box className={cn(classes.cardsContainer, 'u-scrollbar--thinner--self')}>
        <Grid container spacing={1}>
          {renderCards()}
        </Grid>
      </Box>
    </Box>
  )
}

export default MapView
