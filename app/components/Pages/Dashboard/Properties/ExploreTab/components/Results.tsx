import { useRef, useState, useEffect, useMemo } from 'react'

import {
  Grid,
  Box,
  makeStyles,
  ButtonGroup,
  Button,
  alpha
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import cn from 'classnames'

import { AnimatedLoader } from 'components/AnimatedLoader'

import {
  getListingsPage,
  getResultsCountText
} from '../../helpers/pagination-utils'
import { PAGE_SIZE } from '../../mapOptions'
import useListingsContext from '../hooks/useListingsContext'

import { CardsView } from './CardsView'
import { ViewType } from './ExplorePage'
import { MapToggler } from './MapToggler'
import { Sort } from './Sort'
import { TableView } from './TableView'

const useStyles = makeStyles(
  () => ({
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
    resultsHeader: {
      padding: '10px 0',
      zIndex: 2
    },
    resultsContainer: {
      flexGrow: 1,
      position: 'relative'
    },
    scrollableContent: {
      position: 'absolute',
      paddingBottom: 80,
      maxHeight: '100%',
      overflowY: 'auto',
      width: '100%',
      scrollBehavior: 'smooth'
    },
    viewSwitcher: {
      '&.active': {
        boxShadow: 'inset 0px 0px 11px -7px #000000',
        backgroundColor: '#00B286',
        color: '#fff'
      }
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

interface Props {
  mapIsShown: boolean
  onMapToggle: () => void
  viewType: ViewType
  onToggleView: (to: ViewType) => void
  isWidget: boolean
}

export const Results = ({
  mapIsShown,
  onMapToggle,
  viewType,
  onToggleView,
  isWidget
}: Props) => {
  const classes = useStyles()
  const [state] = useListingsContext()
  const [currentPage, setCurrentPage] = useState(1)
  const cardsContainerRef = useRef<Nullable<HTMLDivElement>>(null)

  const paginationIsShown = useMemo(() => {
    // Hide pagination and results count if there is loading and listings are not loaded yet
    return state.result.listings.length > 0 || !state.isLoading
  }, [state.result.listings.length, state.isLoading])

  const listingsPage = useMemo(() => {
    return getListingsPage(state.result.listings, currentPage, PAGE_SIZE)
  }, [state.result.listings, currentPage])

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
  }, [state.isLoading, state.result.listings.length])

  return (
    <Grid container className={classes.root}>
      {state.isLoading && (
        <Grid container className={classes.loaderContainer}>
          <AnimatedLoader />
        </Grid>
      )}
      <Grid container className={classes.resultsHeader}>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" height={1}>
            {!mapIsShown && (
              <MapToggler checked={mapIsShown} onChange={onMapToggle} />
            )}
            {paginationIsShown && (
              <>
                {getResultsCountText(
                  state.result.listings.length,
                  currentPage,
                  PAGE_SIZE
                )}
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" flexDirection="row-reverse">
            <Sort />
            &nbsp;
            <ButtonGroup
              size="small"
              aria-label="outlined primary button group"
            >
              <Button
                onClick={() => onToggleView('cards')}
                className={cn(classes.viewSwitcher, {
                  active: viewType === 'cards'
                })}
              >
                Cards
              </Button>
              <Button
                onClick={() => onToggleView('table')}
                className={cn(classes.viewSwitcher, {
                  active: viewType === 'table'
                })}
              >
                Table
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>
      <div className={classes.resultsContainer}>
        <Grid
          ref={cardsContainerRef}
          container
          className={classes.scrollableContent}
        >
          {viewType === 'cards' && (
            <CardsView
              mapIsShown={mapIsShown}
              listings={listingsPage}
              isWidget={isWidget}
            />
          )}
          {viewType === 'table' && (
            <TableView mapIsShown={mapIsShown} listings={listingsPage} />
          )}
          {paginationIsShown && (
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
