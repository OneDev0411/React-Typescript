import { useCallback, useState } from 'react'

import { Button, Grid } from '@material-ui/core'
import { mdiFileDownloadOutline } from '@mdi/js'
import { saveAs } from 'file-saver'
import { isEqual, pickBy } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce, useFirstMountState } from 'react-use'

import { useQueryParam } from '@app/hooks/use-query-param'
import { exportFilter } from '@app/models/Deal/deal'
import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import { Filters as BaseFilters } from '@app/views/components/Filters'
import FilterButton from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { searchDeals } from 'actions/deals'

import {
  CHANGE_FILTERS_DEBOUNCE_MS,
  DEALS_LIST_DEFAULT_FILTERS,
  DEALS_LIST_DEFUALT_ORDER
} from '../../constants'
import {
  DealsListFilters,
  DealsListPayload,
  DealsOrder,
  SearchQuery
} from '../../types'

import { ClosingDateEditor } from './closingDateEditor'
import { ClosingDateButton } from './closingDateEditor/button'
import { ExecutedDateEditor } from './executedDate'
import { ExecutedDateButton } from './executedDate/button'
import { ExpirationDateEditor } from './expirationDateEditor'
import { ExpirationDateButton } from './expirationDateEditor/button'
import { ListDateEditor } from './listDateEditor'
import { ListDateButton } from './listDateEditor/button'
import { StatusEditor } from './statusEditor'
import { StatusButton } from './statusEditor/button'
import { useStyles } from './styles'
import { TypeEditor } from './typeEditor'
import { TypeButton } from './typeEditor/button'
import { UseFiltersWithQuery } from './useFiltersWithQuery'

interface Props {
  searchQuery: SearchQuery
}

export const Filters = ({ searchQuery }: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isFirstMount = useFirstMountState()

  const [queryParamValue] = useQueryParam('q')

  // TODO: we should replace the order
  const sortOption: DealsOrder = DEALS_LIST_DEFUALT_ORDER
  // const [sortByParamValue] = useQueryParam('sortBy')
  // const [sortTypeParamValue] = useQueryParam('sortType')

  const [isExporting, setIsExporting] = useState(false)

  const user = useSelector(selectUser)
  const activeBrand = useSelector(selectActiveBrand)

  // TODO: create a utils for this
  const [userFilters, setUserFilters] = UseFiltersWithQuery()

  const onFiltersChange = (changedFilters: Partial<DealsListFilters>) => {
    setUserFilters(oldFilters => ({ ...oldFilters, ...changedFilters }))
  }

  const onExportList = useCallback(async () => {
    // TODO: export list

    const payload = {
      $order: sortOption,
      brand: activeBrand.id,
      query: searchQuery?.term || '',
      ...userFilters
    }

    setIsExporting(true)

    const response = await exportFilter(payload)

    setIsExporting(false)

    saveAs(response.body, 'deals.xlsx')
  }, [sortOption, activeBrand.id, searchQuery?.term, userFilters])

  useDebounce(
    () => {
      if (!isFirstMount) {
        // remove false statuses from the user filters
        const cleanedUserFilters: DealsListFilters = {
          ...userFilters,
          status: pickBy(userFilters.status, v => v === true)
        }

        const payload: DealsListPayload = {
          ...cleanedUserFilters,
          $order: sortOption,
          query: queryParamValue ?? ''
        }

        dispatch(searchDeals(user, payload))
      }
    },
    CHANGE_FILTERS_DEBOUNCE_MS,
    [userFilters, isFirstMount, queryParamValue]
  )

  return (
    <Grid container className={classes.root}>
      <BaseFilters<DealsListFilters>
        systemDefaultFilters={DEALS_LIST_DEFAULT_FILTERS}
        userFilters={userFilters}
        onChange={filters => onFiltersChange(filters)}
      >
        {(
          currentFilters,
          updateFilters,
          resetFilters,
          systemDefaultFilters
        ) => (
          <>
            <Grid className={classes.filtersWrapper}>
              {/* Deals Type Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <TypeButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <TypeEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                  />
                )}
              />
              {/* Deals Status Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <StatusButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <StatusEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                  />
                )}
              />

              {/* contract date Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <ExecutedDateButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <ExecutedDateEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                  />
                )}
              />

              {/* Closing date Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <ClosingDateButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <ClosingDateEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                  />
                )}
              />

              {/* List date Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <ListDateButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <ListDateEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                  />
                )}
              />

              {/* List expiration Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <ExpirationDateButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <ExpirationDateEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                  />
                )}
              />
            </Grid>

            <Grid className={classes.actionsWrapper}>
              {/* Export button  */}
              <Button
                className={classes.exportButton}
                variant="contained"
                onClick={onExportList}
                color="primary"
                size="medium"
                disabled={isExporting}
                startIcon={
                  <SvgIcon
                    path={mdiFileDownloadOutline}
                    size={muiIconSizes.small}
                  />
                }
              >
                {isExporting ? 'Exporting...' : ' Export List'}
              </Button>
              {/* Reset button  */}
              <Button
                className={classes.resetButton}
                variant="outlined"
                onClick={resetFilters}
                disabled={isEqual(currentFilters, systemDefaultFilters)}
                size="medium"
              >
                Reset Search
              </Button>
            </Grid>
          </>
        )}
      </BaseFilters>
    </Grid>
  )
}
