import { useRef, useState, useEffect, useMemo, useCallback } from 'react'

import { Grid, Box, makeStyles, alpha, Typography } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'

import { sortListingsByIndex } from '@app/components/Pages/Dashboard/MLS/helpers/sort-utils'
import { noop } from '@app/utils/helpers'
import { AnimatedLoader } from '@app/views/components/AnimatedLoader'

import { CardsView } from '../../../components/CardsView'
import { ResultsHeader } from '../../../components/ResultsHeader'
import { TableView } from '../../../components/TableView'
import ZeroState from '../../../components/ZeroState'
import { PAGE_SIZE, QUERY_LIMIT } from '../../../constants'
import { changeListingHoverState } from '../../../context/actions'
import useUiListingsContext from '../../../context/useUiListingsContext'
import { getListingsPage } from '../../../helpers/pagination-utils'
import { SortIndex, SortString, ViewType } from '../../../types'
import { removeListing } from '../../context/actions'
import useFavoritesContext from '../../hooks/useFavoritesContext'

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
  { name: 'PropertiesResultsFavoritesTab' }
)

interface Props {
  mapIsShown: boolean
  onMapToggle: () => void
  viewType: ViewType
  onToggleView: (to: ViewType) => void
  isWidget: boolean
  onChangeSort: (sort: SortString) => void
  activeSort: { index: SortIndex; ascending: boolean }
  onToggleListingModal?: (id: UUID, isOpen: boolean) => void
}

export const Results = ({
  mapIsShown,
  onMapToggle,
  viewType,
  onToggleView,
  activeSort,
  onChangeSort,
  isWidget,
  onToggleListingModal = noop
}: Props) => {
  const classes = useStyles()
  const [state, dispatch] = useFavoritesContext()
  const [uiState, uiDispatch] = useUiListingsContext()

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
    const sortedListings = sortListingsByIndex(
      state.result.listings,
      activeSort.index,
      activeSort.ascending
    )

    return getListingsPage(sortedListings, currentPage, PAGE_SIZE)
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
    if (state.isLoading) {
      setCurrentPage(1)
      scrollToTop()
    }
  }, [state.isLoading])

  const handleChangeHoverState = useCallback(
    (listingId: UUID, hover: boolean) => {
      uiDispatch(changeListingHoverState(hover ? listingId : null))
    },
    [uiDispatch]
  )

  const handleToggleLike = useCallback(
    (listingId: UUID) => {
      // Close listing modal after toggle like to prevent multiple toggling issue
      // https://gitlab.com/rechat/web/-/issues/5708#note_709319289
      onToggleListingModal('', false)
      dispatch(removeListing(listingId))
    },
    [dispatch, onToggleListingModal]
  )

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
            <ZeroState
              image="/static/images/zero-state/mls-favorites.png"
              title="You don’t have any Favorites"
              subtitle="Try adding a new Favorite"
            />
          ) : (
            <>
              {viewType === 'cards' && (
                <CardsView
                  mapIsShown={mapIsShown}
                  listings={listingsPage}
                  isWidget={isWidget}
                  listingStates={uiState}
                  onChangeHoverState={handleChangeHoverState}
                  onToggleLike={handleToggleLike}
                  unselectOnToggleFavorite
                  onToggleListingModal={onToggleListingModal}
                />
              )}
              {viewType === 'table' && (
                <TableView
                  mapIsShown={mapIsShown}
                  listings={listingsPage}
                  isWidget={isWidget}
                  listingStates={uiState}
                  onChangeHoverState={handleChangeHoverState}
                  onToggleLike={handleToggleLike}
                  onToggleListingModal={onToggleListingModal}
                  closeModalAfterToggleFavorite
                />
              )}
            </>
          )}
          {paginationShouldShown && (
            <>
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
              {state.result.info && state.result.info.total > QUERY_LIMIT && (
                <Grid container justifyContent="center">
                  <Typography variant="caption" component="p">
                    We only show {QUERY_LIMIT} results for general searches. To
                    get more specific results please zoom in.
                  </Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </div>
    </Grid>
  )
}
