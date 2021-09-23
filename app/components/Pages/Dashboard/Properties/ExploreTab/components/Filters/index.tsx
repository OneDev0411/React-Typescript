import { useEffect, useState } from 'react'

import { Button } from '@material-ui/core'
import { isEqual } from 'lodash'

import { Filters as BaseFilters } from '@app/views/components/Filters'
import FilterButton from '@app/views/components/Filters/FilterButton'

import {
  PROPERTY_TYPES_DEFAULT_VALUES,
  RES_FILTERS_DEFAULT_VALUES
} from '../../../constants/constants'
import { updateFilters } from '../../context/actions'
import useListingsContext from '../../hooks/useListingsContext'

import { BathsEditor } from './bathsEditor'
import { BathsButton } from './bathsEditor/button'
import { BedsEditor } from './bedsEditor'
import { BedsButton } from './bedsEditor/button'
import { OtherEditor } from './otherEditor'
import { OtherButton } from './otherEditor/button'
import { PriceEditor } from './priceEditor'
import { PriceButton } from './priceEditor/button'
import { useStyles } from './styles'
import { TypeEditor } from './typeEditor'
import { TypeButton } from './typeEditor/button'

export const Filters = () => {
  const classes = useStyles()
  const [state, dispatch] = useListingsContext()

  const [initialFilters, setInitialFilters] =
    useState<Nullable<AlertFilters>>(null)

  const resultsCount = state.result.info?.total || 0

  const selectedPropertyType = (
    state.search.filters.property_types as IPropertyType[]
  )[0]

  const onFiltersChange = (filters: Partial<AlertFilters>) => {
    dispatch(updateFilters(filters))
  }

  useEffect(() => {
    setInitialFilters(PROPERTY_TYPES_DEFAULT_VALUES[selectedPropertyType])
  }, [selectedPropertyType])

  return (
    <>
      {initialFilters && (
        <BaseFilters<AlertFilters>
          systemDefaultFilters={initialFilters}
          userFilters={state.search.filters}
          resultsCount={resultsCount}
          onChange={filters => onFiltersChange(filters)}
        >
          {(
            currentFilters,
            updateFilters,
            resetFilters,
            systemDefaultFilters,
            resultsCount
          ) => (
            <>
              {/* Property Type Filter  */}
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
                    resultsCount={resultsCount}
                  />
                )}
              />

              {/* Price Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <PriceButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <PriceEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                    resultsCount={resultsCount}
                  />
                )}
              />

              {/* Beds Filter  */}
              {/* Not showing on Lots & Acreage/Commercial  */}
              {!['Lots & Acreage', 'Commercial'].includes(
                currentFilters.property_types[0]
              ) && (
                <FilterButton
                  renderButton={({ onClick }) => (
                    <BedsButton
                      filters={currentFilters}
                      defaultFilters={systemDefaultFilters}
                      onClick={onClick}
                    />
                  )}
                  renderDropdown={() => (
                    <BedsEditor
                      filters={currentFilters}
                      updateFilters={updateFilters}
                      defaultFilters={systemDefaultFilters}
                      resultsCount={resultsCount}
                    />
                  )}
                />
              )}

              {/* Bath Filter  */}
              {/* Not showing on Lots & Acreage/Commercial  */}
              {!['Lots & Acreage', 'Commercial'].includes(
                currentFilters.property_types[0]
              ) && (
                <FilterButton
                  renderButton={({ onClick }) => (
                    <BathsButton
                      filters={currentFilters}
                      defaultFilters={systemDefaultFilters}
                      onClick={onClick}
                    />
                  )}
                  renderDropdown={() => (
                    <BathsEditor
                      filters={currentFilters}
                      updateFilters={updateFilters}
                      defaultFilters={systemDefaultFilters}
                      resultsCount={resultsCount}
                    />
                  )}
                />
              )}

              {/* Other Filter  */}
              <FilterButton
                renderButton={({ onClick }) => (
                  <OtherButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <OtherEditor
                    filters={currentFilters}
                    updateFilters={updateFilters}
                    defaultFilters={systemDefaultFilters}
                    resultsCount={resultsCount}
                  />
                )}
              />

              {/* Reset button  */}
              <Button
                className={classes.resetButton}
                variant="outlined"
                onClick={() => {
                  updateFilters({ ...RES_FILTERS_DEFAULT_VALUES })
                }}
                disabled={isEqual(currentFilters, systemDefaultFilters)}
                size="medium"
              >
                Reset Search
              </Button>
            </>
          )}
        </BaseFilters>
      )}
    </>
  )
}
