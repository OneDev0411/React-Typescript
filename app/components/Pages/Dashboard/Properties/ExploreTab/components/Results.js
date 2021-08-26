import { Grid, Box, makeStyles, ButtonGroup, Button } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import cn from 'classnames'

import { AnimatedLoader } from 'components/AnimatedLoader'

import useListingsContext from '../hooks/useListingsContext'

import { CardsView } from './CardsView'
import { MapToggler } from './MapToggler'
import { Sort } from './Sort'
import { TableView } from './TableView'

const useStyles = makeStyles(
  () => ({
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
      maxHeight: '100%',
      overflowY: 'auto',
      width: '100%'
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
      justifyContent: 'center',
      alignContent: 'center',
      padding: 30
    }
  }),
  { name: 'PropertiesResults' }
)

export const Results = ({
  mapIsShown,
  onMapToggle,
  viewType,
  onToggleView
}) => {
  const classes = useStyles()
  const [state] = useListingsContext()

  return (
    <>
      <Grid container className={classes.resultsHeader}>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" height={1}>
            {!mapIsShown && (
              <MapToggler checked={mapIsShown} onChange={onMapToggle} />
            )}
            Showing 1 - 20 of 2277 listings
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
      <Box className={classes.resultsContainer}>
        {state.isLoading && <AnimatedLoader />}
        <Grid container className={classes.scrollableContent}>
          {viewType === 'cards' && (
            <CardsView mapIsShown={mapIsShown} result={state.result} />
          )}
          {viewType === 'table' && (
            <TableView mapIsShown={mapIsShown} result={state.result} />
          )}
          <Box className={classes.paginationContainer}>
            <Pagination
              count={10}
              variant="outlined"
              size="large"
              shape="rounded"
            />
          </Box>
        </Grid>
      </Box>
    </>
  )
}
