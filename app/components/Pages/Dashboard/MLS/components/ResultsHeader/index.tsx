import { useMemo } from 'react'

import { makeStyles, Box, Grid } from '@material-ui/core'

import { PAGE_SIZE } from '../../constants'
import { SortIndex, SortString, ViewType } from '../../types'
import { MapToggler } from '../MapToggler'

import { ResultCount } from './ResultCount'
import { SortDropdown } from './SortDropdown'
import ViewSwitcher from './ViewSwitcher'

const useStyles = makeStyles(
  theme => ({
    resultsHeader: {
      paddingBottom: theme.spacing(2),
      zIndex: 2
    }
  }),
  { name: 'ListingsResultsHeader' }
)

interface Props {
  isLoading: boolean
  mapIsShown: boolean
  resultsCount: number
  total?: number
  currentPage: number
  pageSize?: number
  viewType: ViewType
  onToggleView: (to: ViewType) => void
  onMapToggle: () => void
  onChangeSort: (sort: SortString) => void
  activeSort: { index: SortIndex; ascending: boolean }
}

export function ResultsHeader({
  isLoading,
  mapIsShown,
  currentPage,
  resultsCount,
  total,
  viewType,
  onMapToggle,
  onToggleView,
  onChangeSort,
  activeSort,
  pageSize = PAGE_SIZE
}: Props) {
  const classes = useStyles()

  const resultsCountShouldShown = useMemo(() => {
    // Hide results count if there is loading and listings are not loaded yet
    return resultsCount > 0 && !isLoading
  }, [resultsCount, isLoading])

  const actionBarShoudShown = useMemo(() => {
    // Show SortDropdown, ViewSwitcher if there is not loading and listings are empty
    return resultsCount === 0 && !isLoading
  }, [resultsCount, isLoading])

  return (
    <Grid container className={classes.resultsHeader}>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center" height={1}>
          {!mapIsShown && (
            <MapToggler checked={mapIsShown} onChange={onMapToggle} />
          )}
          {resultsCountShouldShown && (
            <ResultCount
              resultsCount={resultsCount}
              currentPage={currentPage}
              pageSize={pageSize}
              total={total}
            />
          )}
        </Box>
      </Grid>
      <Grid item xs={6}>
        {!actionBarShoudShown && (
          <Box display="flex" flexDirection="row-reverse">
            <SortDropdown onChangeSort={onChangeSort} activeSort={activeSort} />
            <ViewSwitcher onToggleView={onToggleView} viewType={viewType} />
          </Box>
        )}
      </Grid>
    </Grid>
  )
}
