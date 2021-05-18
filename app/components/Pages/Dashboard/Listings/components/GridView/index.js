import React, { useState, memo } from 'react'
import { Grid, Box, makeStyles } from '@material-ui/core'
import { useDeepCompareEffect } from 'react-use'

import { useInfiniteScroll } from 'hooks/use-infinite-scroll'
import { useListSelection } from 'components/ListSelection/use-list-selection'

import ListingCard from '../ListingCardWithFavorite'

import LoadingComponent from '../../../../../../views/components/Spinner'

import ZeroState from '../ZeroState'

const PAGE_SIZE = 12

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
  gridContainer: {
    position: 'absolute'
  }
}))

function GridView({ isFetching, sortedListings }) {
  const { selections, toggleItem } = useListSelection()
  const classes = useStyles()

  const [limit, setLimit] = useState(PAGE_SIZE)
  const loadNextPage = () => setLimit(limit => limit + PAGE_SIZE)

  useInfiniteScroll({
    accuracy: 600,
    debounceTime: 100,
    onScrollBottom: loadNextPage
  })

  useDeepCompareEffect(() => {
    setLimit(PAGE_SIZE)
  }, [sortedListings])

  const renderContent = () => {
    if (isFetching) {
      return <LoadingComponent />
    }

    if (!sortedListings.length) {
      return <ZeroState />
    }

    return sortedListings.slice(0, limit).map(listing => (
      <Grid key={listing.id} item xs={12} sm={12} md={6} lg={4} xl={3}>
        <ListingCard
          listing={listing}
          tags={listing.new ? [listing.new] : undefined}
          selected={selections.some(item => item.id === listing.id)}
          onToggleSelection={() => toggleItem(listing)}
        />
      </Grid>
    ))
  }

  return (
    <Box className={classes.container}>
      <Grid container spacing={2} className={classes.gridContainer}>
        {renderContent()}
      </Grid>
    </Box>
  )
}

export default memo(GridView)
