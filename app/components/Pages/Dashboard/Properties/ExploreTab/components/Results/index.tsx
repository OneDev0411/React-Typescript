import { useRef, useState, useEffect, useMemo } from 'react'

import { Grid, Box, makeStyles, alpha } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import memoize from 'lodash/memoize'
import hash from 'object-hash'

import { AnimatedLoader } from 'components/AnimatedLoader'

import { CardsView } from '../../../components/CardsView'
import { ResultsHeader } from '../../../components/ResultsHeader'
import { TableView } from '../../../components/TableView'
import ZeroState from '../../../components/ZeroState'
import { PAGE_SIZE } from '../../../constants/constants'
import { getListingsPage } from '../../../helpers/pagination-utils'
import { sortByIndex, SortIndex, SortString } from '../../../helpers/sort-utils'
import useListingsContext from '../../hooks/useListingsContext'
import { ViewType } from '../ExplorePage'

const useStyles = makeStyles(
  theme => ({
    root: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    loaderContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: alpha('#fff', 0.7),
      zIndex: 3
    },
    resultsContainer: {
      flexGrow: 1,
      position: 'relative'
    },
    toggleViewButton: {
      margin: theme.spacing(0, 0.5),
      '&.Mui-selected': {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        backgroundColor: 'unset'
      }
    },
    scrollableContent: {
      position: 'absolute',
      paddingBottom: 80,
      maxHeight: '100%',
      overflowY: 'auto',
      width: '100%',
      scrollBehavior: 'smooth',
      zIndex: 1
    },
    paginationContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignContent: 'center',
      padding: 30
    }
  }),
  { name: 'PropertiesResults' }
)

// TODO: remove this function after API sorting is ready
// https://gitlab.com/rechat/server/-/issues/1839
const sortListings = memoize(
  (listings: ICompactListing[], index: SortIndex, ascending: boolean) => {
    return listings.sort((a, b) => sortByIndex(a, b, index, ascending))
  },
  (...args) => `${hash(args[0])}_${args[1]}_${args[2]}`
)

interface Props {
  mapIsShown: boolean
  onMapToggle: () => void
  viewType: ViewType
  onToggleView: (to: ViewType) => void
  isWidget: boolean
  onChangeSort: (sort: SortString) => void
  activeSort: { index: SortIndex; ascending: boolean }
}

export const Results = ({
  mapIsShown,
  onMapToggle,
  viewType,
  onToggleView,
  activeSort,
  onChangeSort,
  isWidget
}: Props) => {
  const classes = useStyles()
  const [state] = useListingsContext()
  const [currentPage, setCurrentPage] = useState(1)
  const cardsContainerRef = useRef<Nullable<HTMLDivElement>>(null)

  const paginationShouldShown = useMemo(() => {
    // Hide pagination and results count if there is loading and listings are not loaded yet
    return state.result.listings.length > 0 && !state.isLoading
  }, [state.result.listings.length, state.isLoading])

  const zeroStateShouldShown = useMemo(() => {
    // Show zero state if there is not loading and listings are empty
    return state.result.listings.length === 0 && !state.isLoading
  }, [state.result.listings.length, state.isLoading])

  const listingsPage = useMemo(() => {
    return getListingsPage(
      sortListings(
        state.result.listings,
        activeSort.index,
        activeSort.ascending
      ),
      currentPage,
      PAGE_SIZE
    )
  }, [
    state.result.listings,
    activeSort.index,
    activeSort.ascending,
    currentPage
  ])

  const scrollToTop = () => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.scrollTop = 0
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    scrollToTop()
  }

  useEffect(() => {
    setCurrentPage(1)
    scrollToTop()
  }, [state.result.listings])

  return (
    <Grid container className={classes.root}>
      {state.isLoading && (
        <Grid container className={classes.loaderContainer}>
          <AnimatedLoader />
        </Grid>
      )}
      <ResultsHeader
        isLoading={state.isLoading}
        mapIsShown={mapIsShown}
        currentPage={currentPage}
        resultsCount={state.result.listings.length}
        total={state.result.info?.total}
        viewType={viewType}
        onMapToggle={onMapToggle}
        onToggleView={onToggleView}
        onChangeSort={onChangeSort}
        activeSort={activeSort}
      />
      <div className={classes.resultsContainer}>
        <Grid
          ref={cardsContainerRef}
          container
          className={classes.scrollableContent}
        >
          {zeroStateShouldShown ? (
            <ZeroState />
          ) : (
            <>
              {viewType === 'cards' && (
                <CardsView
                  mapIsShown={mapIsShown}
                  listings={listingsPage}
                  isWidget={isWidget}
                />
              )}
              {viewType === 'table' && (
                <TableView
                  mapIsShown={mapIsShown}
                  listings={listingsPage}
                  isWidget={isWidget}
                />
              )}
            </>
          )}
          {paginationShouldShown && (
            <Box className={classes.paginationContainer}>
              <Pagination
                page={currentPage}
                onChange={handlePageChange}
                count={Math.ceil(state.result.listings.length / PAGE_SIZE)}
                variant="outlined"
                color="primary"
                size="large"
                shape="rounded"
              />
            </Box>
          )}
        </Grid>
      </div>
    </Grid>
  )
}
