import React, { useState, useRef, memo } from 'react'
import cn from 'classnames'
import { Grid, Box, makeStyles } from '@material-ui/core'
import { useDeepCompareEffect } from 'react-use'

import { useInfiniteScroll } from 'hooks/use-infinite-scroll'
import { useListSelection } from 'components/ListSelection/use-list-selection'
import LoadingComponent from 'components/Spinner'

import ListingCard from '../ListingCardWithFavorite'
import ZeroState from '../ZeroState'

const VERTICAL_GAP_FROM_PAGE_TOP = '12em' // It's the page header height
const PAGE_SIZE = 12

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
      paddingRight: theme.spacing(0.5),
      overflowY: 'scroll',
      borderLeft: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'MapView' }
)

const MapView = props => {
  const classes = useStyles()
  const { selections, toggleItem } = useListSelection()

  const cardsContainerRef = useRef()
  const [limit, setLimit] = useState(PAGE_SIZE)
  const loadNextPage = () => setLimit(limit => limit + PAGE_SIZE)

  useInfiniteScroll({
    container: cardsContainerRef,
    accuracy: 300,
    debounceTime: 100,
    onScrollBottom: loadNextPage
  })

  useDeepCompareEffect(() => {
    setLimit(PAGE_SIZE)
  }, [props.sortedListings])

  const renderCards = () => {
    if (props.isFetching) {
      return <LoadingComponent />
    }

    if (!props.sortedListings.length) {
      return <ZeroState />
    }

    return props.sortedListings.slice(0, limit).map(listing => (
      <Grid key={listing.id} item md={12} lg={6}>
        <Box pb={1} pl={1}>
          <ListingCard
            listing={listing}
            tags={listing.new ? [listing.new] : undefined}
            selected={selections.some(item => item.id === listing.id)}
            onToggleSelection={() => toggleItem(listing)}
          />
        </Box>
      </Grid>
    ))
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.mapContainer}>{props.Map}</Box>
      <Box
        // See: https://github.com/mui-org/material-ui/issues/17010
        ref={cardsContainerRef} // @ts-ignore
        className={cn(classes.cardsContainer, 'u-scrollbar--thinner--self')}
        display={{ xs: 'none', md: 'block' }}
      >
        <Grid container>{renderCards()}</Grid>
      </Box>
    </Box>
  )
}

export default memo(MapView)
