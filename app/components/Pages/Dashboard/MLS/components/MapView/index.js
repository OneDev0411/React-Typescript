import React, { useState, useRef, memo, useEffect } from 'react'

import { Grid, Box, makeStyles, Typography } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import cn from 'classnames'

import { useListSelection } from '@app/views/components/ListSelection/use-list-selection'
import LoadingComponent from '@app/views/components/Spinner'

import { QUERY_LIMIT, PAGE_SIZE } from '../../constants'
import { getListingsPage } from '../../helpers/pagination-utils'
import ListingCard from '../ListingCardWithFavorite'
import { ResultsHeader } from '../ResultsHeader'
import { ShareListings } from '../ShareListings'
import ZeroState from '../ZeroState'

const useStyles = makeStyles(
  theme => ({
    container: {
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        overflow: 'hidden',
        flexGrow: 1
      }
    },
    mapContainer: {
      flexBasis: '50%',
      minHeight: '100%',
      position: 'relative'
    },
    cardsContainer: {
      flexBasis: '50%',
      minHeight: '100%',
      paddingRight: theme.spacing(0.5),
      borderLeft: `1px solid ${theme.palette.divider}`,
      position: 'relative'
    },
    resultsHeaderContainer: {
      paddingLeft: theme.spacing(1)
    },
    cardsGridContainer: {
      maxHeight: '100%',
      overflowY: 'scroll',
      position: 'absolute',
      scrollBehavior: 'smooth'
    },
    card: {
      zIndex: 1
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      margin: theme.spacing(5, 0),
      paddingBottom: theme.spacing(8)
    },
    selectionActionBar: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      width: 'calc(100% - 192px)'
    }
  }),
  { name: 'MapView' }
)

const MapView = props => {
  const classes = useStyles()
  const { selections, toggleItem } = useListSelection()
  const [currentPage, setCurrentPage] = useState(1)

  const cardsContainerRef = useRef()

  const scrollToTop = () => {
    cardsContainerRef.current.firstChild.scrollTop = 0
  }

  const isListingsDisplayed = !props.isFetching && props.sortedListings.length

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    scrollToTop()
  }

  const renderCards = () => {
    if (props.isFetching) {
      return <LoadingComponent />
    }

    if (!props.sortedListings.length) {
      return (
        <ZeroState
          image={
            props.tabName === 'favorites'
              ? '/static/images/zero-state/mls-favorites.png'
              : '/static/images/zero-state/agents-network.png'
          }
          title={
            props.tabName === 'favorites'
              ? 'You don’t have any Favorites'
              : 'The search you saved has no results'
          }
          subtitle={
            props.tabName === 'favorites'
              ? 'Try adding a new Favorite'
              : 'Try adding a new Saved Search'
          }
        />
      )
    }

    return getListingsPage(props.sortedListings, currentPage, PAGE_SIZE).map(
      listing => (
        <Grid className={classes.card} key={listing.id} item md={12} lg={6}>
          <Box pb={1} pl={1}>
            <ListingCard
              isWidget={props.isWidget}
              listing={listing}
              tags={listing.new ? [listing.new] : undefined}
              selected={selections.some(item => item.id === listing.id)}
              onToggleListingModal={props.onToggleListingModal}
              onToggleSelection={() => toggleItem(listing)}
            />
          </Box>
        </Grid>
      )
    )
  }

  useEffect(() => {
    setCurrentPage(1)
    scrollToTop()
  }, [props.sortedListings])

  return (
    <Box className={classes.container}>
      <Box className={classes.mapContainer}>{props.Map}</Box>
      <Box
        ref={cardsContainerRef}
        className={cn(classes.cardsContainer, 'u-scrollbar--thinner--self')}
        display={{ xs: 'none', md: 'block' }}
      >
        <Grid container className={classes.cardsGridContainer}>
          <Grid container className={classes.resultsHeaderContainer}>
            <ResultsHeader
              isLoading={props.isFetching}
              mapIsShown
              total={props.info?.total}
              currentPage={currentPage}
              resultsCount={props.sortedListings.length}
              viewType="card"
              onMapToggle={() => {}}
              onToggleView={props.onToggleView}
              onChangeSort={props.onChangeSort}
              activeSort={props.activeSort}
            />
          </Grid>
          {renderCards()}
          {isListingsDisplayed ? (
            <>
              <Grid container className={classes.paginationContainer}>
                <Pagination
                  page={currentPage}
                  onChange={handlePageChange}
                  count={Math.ceil(props.sortedListings.length / PAGE_SIZE)}
                  variant="outlined"
                  color="primary"
                  size="large"
                  shape="rounded"
                />
              </Grid>
              {props.info && props.info.total > QUERY_LIMIT && (
                <Grid container justifyContent="center">
                  <Typography variant="caption" component="p">
                    We only show {QUERY_LIMIT} results for saved searches.
                  </Typography>
                </Grid>
              )}
            </>
          ) : null}
        </Grid>
      </Box>
      <Box className={classes.selectionActionBar}>
        <ShareListings />
      </Box>
    </Box>
  )
}

export default memo(MapView)
