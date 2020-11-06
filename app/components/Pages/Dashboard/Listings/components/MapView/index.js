import React from 'react'
import cn from 'classnames'
import { makeStyles, Box, Grid } from '@material-ui/core'

import LoadingComponent from 'components/Spinner'

import { useListSelection } from 'components/ListSelection/use-list-selection'

import ListingCard from '../ListingCard'
import ZeroState from '../ZeroState'

const CARDS_CONTAINER_WIDTH = '27em'
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
        width: `calc(100% - ${CARDS_CONTAINER_WIDTH})`
      }
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
  const { selections, toggleItem } = useListSelection()

  const renderCards = () => {
    if (props.isFetching) {
      return <LoadingComponent />
    }

    if (!props.sortedListings.length) {
      return <ZeroState />
    }

    return props.sortedListings.map(listing => (
      <Grid key={listing.id} item xs={12}>
        <ListingCard
          listing={listing}
          tabName={props.tabName}
          user={props.user}
          selected={selections.some(item => item.id === listing.id)}
          onToggleSelection={toggleItem}
        />
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
        <Grid container spacing={1}>
          {renderCards()}
        </Grid>
      </Box>
    </Box>
  )
}

export default MapView
