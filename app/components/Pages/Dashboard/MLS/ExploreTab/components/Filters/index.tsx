import { useEffect, useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiRotateRight } from '@mdi/js'
import { isEqual } from 'lodash'
import { useLocalStorage } from 'react-use'

import { getPropertyTypeFirstElement } from '@app/components/Pages/Dashboard/MLS/helpers/get-listings-helpers'
import { Filters as BaseFilters } from '@app/views/components/Filters'
import FilterButton from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import {
  PROPERTIES_FILTERS_STORAGE_KEY,
  PROPERTY_TYPES_DEFAULT_VALUES,
  RES_FILTERS_DEFAULT_VALUES
} from '../../../constants'
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
  const [, setStorageValue] = useLocalStorage<Nullable<string>>(
    PROPERTIES_FILTERS_STORAGE_KEY,
    null
  )

  const [initialFilters, setInitialFilters] =
    useState<Nullable<AlertFilters>>(null)

  const resultsCount = state.result.info?.total || 0

  const selectedPropertyType = (
    state.search.filters.property_types as IPropertyType[]
  )[0]

  const onFiltersChange = (filters: Partial<AlertFilters>) => {
    dispatch(updateFilters(filters))

    // Save user filters to local storage
    setStorageValue(JSON.stringify(filters))
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

              {/* Not showing beds and bath filters on Lots & Acreage/Commercial  */}

              {/* Beds Filter  */}
              {!['Lots & Acreage', 'Commercial'].includes(
                getPropertyTypeFirstElement(currentFilters) || ''
              ) && (
                <div className={classes.buttonGroup}>
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

                  {/* Bath Filter  */}
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
                </div>
              )}

              {/* Other Filter  */}
              <FilterButton
                className="u-scrollbar--thinner"
                renderButton={({ onClick }) => (
                  <OtherButton
                    filters={currentFilters}
                    defaultFilters={systemDefaultFilters}
                    onClick={onClick}
                  />
                )}
                renderDropdown={() => (
                  <OtherEditor
                    hasMapDrawing={state.search.drawing.length > 0}
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
                disabled={
                  isEqual(currentFilters, systemDefaultFilters) &&
                  getPropertyTypeFirstElement(currentFilters) === 'Residential'
                }
                startIcon={
                  <SvgIcon path={mdiRotateRight} size={muiIconSizes.small} />
                }
                size="small"
              >
                Reset
              </Button>
            </>
          )}
        </BaseFilters>
      )}
    </>
  )
}
