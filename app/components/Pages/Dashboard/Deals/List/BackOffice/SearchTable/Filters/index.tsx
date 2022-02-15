import { useCallback, useState } from 'react'

import { Button, Grid } from '@material-ui/core'
import {
  mdiFileDownloadOutline,
  mdiListStatus,
  mdiCalendarCursor,
  mdiCalendarCheckOutline,
  mdiCalendarPlus,
  mdiCalendarRemove,
  mdiScriptTextOutline,
  mdiRotateRight
} from '@mdi/js'
import { saveAs } from 'file-saver'
import { isEqual, pickBy } from 'lodash'
import { useDispatch } from 'react-redux'
import { useDebounce, useFirstMountState } from 'react-use'

import { useActiveTeam } from '@app/hooks/team/use-active-team'
import { useQueryParam } from '@app/hooks/use-query-param'
import { exportFilter } from '@app/models/Deal/deal'
import { Filters as BaseFilters } from '@app/views/components/Filters'
import BaseFilterButton from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { searchDeals } from 'actions/deals'

import {
  CHANGE_FILTERS_DEBOUNCE_MS,
  DEALS_LIST_DEFAULT_FILTERS,
  DEALS_LIST_DEFUALT_ORDER,
  DEAL_TYPES
} from '../../constants'
import {
  DealsListFilters,
  DealsListPayload,
  DealsOrder,
  SearchQuery
} from '../../types'

import { DateFilterEditor } from './dateFilterEditor'
import { FilterButton } from './filterButton'
import { StatusEditor } from './statusEditor'
import { useStyles } from './styles'
import { DEAL_TYPES_ITEMS, TypeEditor } from './typeEditor'
import { isStatusFilterChanged } from './utils'

interface Props {
  searchQuery: SearchQuery
  userFilters: DealsListFilters
  onFiltersChange: (changedFilters: Partial<DealsListFilters>) => void
}

export const Filters = ({
  searchQuery,
  userFilters,
  onFiltersChange
}: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isFirstMount = useFirstMountState()

  const [queryParamValue] = useQueryParam('q')

  // TODO: We should refactor the whole mechanism for ordering deals lists.
  // just a reminder that this part of the code needs to be changed after refactoring
  const sortOption: DealsOrder = DEALS_LIST_DEFUALT_ORDER

  const [isExporting, setIsExporting] = useState(false)
  const activeTeam = useActiveTeam()
  const activeBrand = activeTeam.brand

  const onExportList = useCallback(async () => {
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

        dispatch(searchDeals(activeTeam, payload))
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
              <BaseFilterButton
                renderButton={({ onClick }) => (
                  <FilterButton
                    onClick={onClick}
                    startIconPath={mdiScriptTextOutline}
                    title={
                      currentFilters.deal_type &&
                      currentFilters.deal_type.length !== DEAL_TYPES.length
                        ? DEAL_TYPES_ITEMS[currentFilters.deal_type[0]]
                        : 'Both Sides'
                    }
                    isActive={
                      !isEqual(
                        currentFilters.deal_type?.sort(),
                        systemDefaultFilters.deal_type?.sort()
                      )
                    }
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
              <BaseFilterButton
                renderButton={({ onClick }) => (
                  <FilterButton
                    onClick={onClick}
                    title="Status"
                    startIconPath={mdiListStatus}
                    isActive={isStatusFilterChanged(
                      systemDefaultFilters,
                      currentFilters
                    )}
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

              <div className={classes.buttonGroup}>
                {/* contract date Filter  */}
                <BaseFilterButton
                  renderButton={({ onClick }) => (
                    <FilterButton
                      onClick={onClick}
                      title="Executed Date"
                      startIconPath={mdiCalendarCursor}
                      isActive={
                        !isEqual(
                          systemDefaultFilters.contexts.contract_date?.date,
                          currentFilters.contexts.contract_date?.date
                        )
                      }
                    />
                  )}
                  renderDropdown={() => (
                    <DateFilterEditor
                      id="contract_date"
                      title="Executed Date"
                      iconPath={mdiCalendarCursor}
                      filters={currentFilters}
                      updateFilters={updateFilters}
                      defaultFilters={systemDefaultFilters}
                    />
                  )}
                />

                {/* Closing date Filter  */}
                <BaseFilterButton
                  renderButton={({ onClick }) => (
                    <FilterButton
                      onClick={onClick}
                      title="Closing Date"
                      startIconPath={mdiCalendarCheckOutline}
                      isActive={
                        !isEqual(
                          systemDefaultFilters.contexts.closing_date?.date,
                          currentFilters.contexts.closing_date?.date
                        )
                      }
                    />
                  )}
                  renderDropdown={() => (
                    <DateFilterEditor
                      id="closing_date"
                      title="Closing Date"
                      iconPath={mdiCalendarCheckOutline}
                      filters={currentFilters}
                      updateFilters={updateFilters}
                      defaultFilters={systemDefaultFilters}
                    />
                  )}
                />
              </div>

              <div className={classes.buttonGroup}>
                {/* List date Filter  */}
                <BaseFilterButton
                  renderButton={({ onClick }) => (
                    <FilterButton
                      onClick={onClick}
                      title="Listing Date"
                      startIconPath={mdiCalendarPlus}
                      isActive={
                        !isEqual(
                          systemDefaultFilters.contexts.list_date?.date,
                          currentFilters.contexts.list_date?.date
                        )
                      }
                    />
                  )}
                  renderDropdown={() => (
                    <DateFilterEditor
                      id="list_date"
                      title="Listing Date"
                      iconPath={mdiCalendarPlus}
                      filters={currentFilters}
                      updateFilters={updateFilters}
                      defaultFilters={systemDefaultFilters}
                    />
                  )}
                />

                {/* List expiration Filter  */}
                <BaseFilterButton
                  renderButton={({ onClick }) => (
                    <FilterButton
                      onClick={onClick}
                      title="Listing Expiration"
                      startIconPath={mdiCalendarRemove}
                      isActive={
                        !isEqual(
                          systemDefaultFilters.contexts.expiration_date?.date,
                          currentFilters.contexts.expiration_date?.date
                        )
                      }
                    />
                  )}
                  renderDropdown={() => (
                    <DateFilterEditor
                      id="expiration_date"
                      title="Listing Expiration"
                      iconPath={mdiCalendarRemove}
                      filters={currentFilters}
                      updateFilters={updateFilters}
                      defaultFilters={systemDefaultFilters}
                    />
                  )}
                />
              </div>
            </Grid>

            <Grid className={classes.actionsWrapper}>
              {/* Export button  */}
              <Button
                className={classes.exportButton}
                variant="contained"
                onClick={onExportList}
                color="primary"
                size="small"
                disabled={isExporting}
                startIcon={
                  <SvgIcon
                    path={mdiFileDownloadOutline}
                    size={muiIconSizes.small}
                  />
                }
              >
                {isExporting ? 'Exporting...' : ' Export'}
              </Button>
              {/* Reset button  */}
              <Button
                className={classes.resetButton}
                variant="outlined"
                onClick={resetFilters}
                disabled={isEqual(currentFilters, systemDefaultFilters)}
                size="small"
                startIcon={
                  <SvgIcon path={mdiRotateRight} size={muiIconSizes.small} />
                }
              >
                Reset
              </Button>
            </Grid>
          </>
        )}
      </BaseFilters>
    </Grid>
  )
}
