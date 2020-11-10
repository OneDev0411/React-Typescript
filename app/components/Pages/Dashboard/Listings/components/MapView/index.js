import React from 'react'
import cn from 'classnames'
import { Grid, Box, makeStyles } from '@material-ui/core'

import LoadingComponent from 'components/Spinner'
import ListingCard from 'components/ListingCards/ListingCard'

import { useListSelection } from 'components/ListSelection/use-list-selection'

import ZeroState from '../ZeroState'

const VERTICAL_GAP_FROM_PAGE_TOP = '12em' // It's the page header height

const useStyles = makeStyles(
  theme => ({
    container: {
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        overflow: 'hidden',
        height: `calc(100vh - ${VERTICAL_GAP_FROM_PAGE_TOP})`
      }
    },
    mapContainer: {
      width: '100%',
      height: '100%',
      position: 'relative',
      [theme.breakpoints.up('md')]: {
        width: '50%'
      }
    },
    cardsContainer: {
      width: '50%',
      padding: theme.spacing(0, 0.5, 2, 2),
      overflowY: 'scroll',
      borderLeft: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'MapView' }
)

const MapView = props => {
  const classes = useStyles()
  const { selections, toggleItem } = useListSelection()

  const renderCards = () => {
    if (props.isFetching) {
      return <LoadingComponent />
    }

    if (!props.sortedListings.length) {
      return <ZeroState />
    }

    return props.sortedListings.map(listing => (
      <Grid key={listing.id} item xs={12} md={6}>
        <Box pb={1} px={1}>
          <ListingCard
            listing={listing}
            selected={selections.some(item => item.id === listing.id)}
            onToggleSelection={toggleItem}
          />
        </Box>
      </Grid>
    ))
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.mapContainer}>{props.Map}</Box>
      <Box
        className={cn(classes.cardsContainer, 'u-scrollbar--thinner--self')}
        display={{ xs: 'none', md: 'block' }}
      >
        <Grid container>{renderCards()}</Grid>
      </Box>
    </Box>
  )
}

export default MapView
