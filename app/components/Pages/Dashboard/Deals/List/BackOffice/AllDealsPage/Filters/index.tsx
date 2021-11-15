import { useEffect, useState } from 'react'

import { Button, Grid } from '@material-ui/core'
import { isEqual } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce, useFirstMountState } from 'react-use'

import { useQueryParam, useReplaceQueryParam } from '@app/hooks/use-query-param'
import { selectUser } from '@app/selectors/user'
import { Filters as BaseFilters } from '@app/views/components/Filters'
import FilterButton from '@app/views/components/Filters/FilterButton'
import { searchDeals } from 'actions/deals'

import {
  CHANGE_FILTERS_DEBOUNCE_MS,
  DEALS_LIST_DEFAULT_FILTERS,
  DEALS_LIST_DEFUALT_ORDER,
  QUERY_ARRAY_PARAM_SPLITTER_CHAR
} from '../../constants'
import { DealsListFilters, DealsListPayload, DealsOrder } from '../../types'

import { useStyles } from './styles'
import { TypeEditor } from './typeEditor'
import { TypeButton } from './typeEditor/button'

export const Filters = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isFirstMount = useFirstMountState()

  const [queryParamValue] = useQueryParam('q')
  const [sortByParamValue] = useQueryParam('sortBy')
  const [sortTypeParamValue] = useQueryParam('sortType')
  const [dealTypeParamValue, setDealTypeParamValue] =
    useReplaceQueryParam('dealType')

  const user = useSelector(selectUser)

  // TODO: create a utils for this
  const [userFilters, setUserFilters] = useState<DealsListFilters>({
    ...DEALS_LIST_DEFAULT_FILTERS,
    ...(dealTypeParamValue
      ? {
          deal_type: dealTypeParamValue.split(
            QUERY_ARRAY_PARAM_SPLITTER_CHAR
          ) as IDealType[]
        }
      : {})
  })

  const onFiltersChange = (changedFilters: Partial<DealsListFilters>) => {
    setUserFilters(oldFilters => ({ ...oldFilters, ...changedFilters }))
  }

  useDebounce(
    () => {
      if (!isFirstMount) {
        // TODO: we should replace the order
        const sortOption: DealsOrder = DEALS_LIST_DEFUALT_ORDER

        const payload: DealsListPayload = {
          ...userFilters,
          $order: sortOption,
          query: queryParamValue ?? ''
        }

        dispatch(searchDeals(user, payload))
      }
    },
    CHANGE_FILTERS_DEBOUNCE_MS,
    [
      userFilters,
      isFirstMount,
      queryParamValue,
      sortByParamValue,
      sortTypeParamValue
    ]
  )

  useEffect(() => {
    if (userFilters.deal_type) {
      setDealTypeParamValue(
        userFilters.deal_type.join(QUERY_ARRAY_PARAM_SPLITTER_CHAR)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters])

  return (
    <Grid className={classes.root} container justifyContent="flex-end">
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
          </>
        )}
      </BaseFilters>
    </Grid>
  )
}
