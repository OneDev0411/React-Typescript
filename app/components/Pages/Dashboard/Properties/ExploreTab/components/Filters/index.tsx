import { Button } from '@material-ui/core'
import { isEqual } from 'lodash'

import { Filters as BaseFilters } from '@app/views/components/Filters'
import FilterButton from '@app/views/components/Filters/FilterButton'

import { FILTERS_INITIAL_VALUES } from '../../../constants/constants'
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

export const Filters = () => {
  const classes = useStyles()
  const [state, dispatch] = useListingsContext()

  const resultsCount = state.result.info?.total || 0

  const onFiltersChange = (filters: Partial<AlertFilters>) => {
    dispatch(updateFilters(filters))
  }

  return (
    <BaseFilters<AlertFilters>
      systemDefaultFilters={FILTERS_INITIAL_VALUES}
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
          {/* <Button
            variant="outlined"
            size="medium"
            className={cn({
              [classes.button]: true,
              active: true
            })}
            startIcon={
              <FiberManualRecordIcon fontSize="small" color="primary" />
            }
            endIcon={<ExpandMoreIcon fontSize="small" />}
          >
            Sale
          </Button> */}

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
  )
}
