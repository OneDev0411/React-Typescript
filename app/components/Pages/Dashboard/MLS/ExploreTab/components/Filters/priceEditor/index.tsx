import { useRef } from 'react'

import { FormHelperText, Grid, TextField, Typography } from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { mdiCurrencyUsd } from '@mdi/js'
import { useDebounce } from 'react-use'

import { getPropertyTypeFirstElement } from '@app/components/Pages/Dashboard/MLS/helpers/get-listings-helpers'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { FilterEditorFooter } from '../filterEditorFooter'
import { preventNonNumbricOnKeyDown } from '../otherEditor/helpers'
import { useStyles } from '../styles'

import { createPriceArray, ConvertPriceShortFormat } from './helpers'

const filter = createFilterOptions<number | null>()
const CHECK_ERROR_DEBOUNCE_TIME = 500

export const PriceEditor = ({
  filters,
  updateFilters,
  defaultFilters,
  resultsCount
}: FilterButtonDropDownProp<AlertFilters>) => {
  const classes = useStyles()

  const validationError = useRef(false)

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    validationError.current = false
  }

  const maxError =
    filters.maximum_price && filters.minimum_price
      ? filters.maximum_price <= filters.minimum_price
      : false

  const minError =
    filters.maximum_price && filters.minimum_price
      ? filters.minimum_price >= filters.maximum_price
      : false

  useDebounce(
    () => {
      validationError.current = minError && maxError
    },
    CHECK_ERROR_DEBOUNCE_TIME,
    [minError, maxError, filters.maximum_price, filters.minimum_price]
  )

  const handleChange = (
    fieldName: keyof typeof defaultFilters,
    newValue: Nullable<number>
  ) => {
    validationError.current = false

    const fieldValue = Number(newValue || 0) || null

    updateFilters({ [fieldName]: fieldValue })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon path={mdiCurrencyUsd} size={muiIconSizes.medium} />
        <Typography variant="subtitle1" className={classes.title}>
          Price
        </Typography>
      </Grid>

      <Grid container alignItems="center" wrap="nowrap">
        <Grid item xs={5}>
          <Autocomplete
            size="small"
            value={filters.minimum_price}
            classes={{ popper: 'u-scrollbar--thinner' }}
            options={createPriceArray({
              propertyType: getPropertyTypeFirstElement(filters),
              max: filters.maximum_price
            })}
            filterOptions={(options, params) => {
              const filtered = filter(options, params)
              const input = params.inputValue ? Number(params.inputValue) : null

              if (input) {
                return [input, ...filtered]
              }

              return filtered
            }}
            onChange={(e: any, newValue: Nullable<number | string>) => {
              handleChange('minimum_price', Number(newValue))
            }}
            getOptionLabel={option =>
              option ? ConvertPriceShortFormat(option) : 'No Min'
            }
            renderInput={params => (
              <TextField
                {...params}
                onChange={handleChangeInput}
                onKeyDown={preventNonNumbricOnKeyDown}
                label="Min"
                variant="outlined"
                error={validationError.current}
              />
            )}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>
        <Grid item container justifyContent="center" xs={2}>
          <Typography className={classes.to} variant="body1">
            To
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Autocomplete
            size="small"
            value={filters.maximum_price}
            classes={{ popper: 'u-scrollbar--thinner' }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params)
              const input = params.inputValue ? Number(params.inputValue) : null

              if (input) {
                return [input, ...filtered]
              }

              return filtered
            }}
            options={createPriceArray({
              propertyType: getPropertyTypeFirstElement(filters),
              min: filters.minimum_price
            })}
            onChange={(e: any, newValue: Nullable<number>) =>
              handleChange('maximum_price', newValue)
            }
            getOptionLabel={option =>
              option ? ConvertPriceShortFormat(option) : 'No Max'
            }
            renderInput={params => (
              <TextField
                {...params}
                onChange={handleChangeInput}
                onKeyDown={preventNonNumbricOnKeyDown}
                placeholder="No Max"
                label="Max"
                variant="outlined"
                error={validationError.current}
              />
            )}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>
      </Grid>
      {validationError.current && (
        <FormHelperText error>
          Please enter valid min and max values!
        </FormHelperText>
      )}
      <FilterEditorFooter
        resultCount={resultsCount}
        disabledReset={
          filters.minimum_price === defaultFilters.minimum_price &&
          filters.maximum_price === defaultFilters.maximum_price
        }
        onClickReset={() => {
          updateFilters({
            minimum_price: defaultFilters.minimum_price,
            maximum_price: defaultFilters.maximum_price
          })
        }}
      />
    </Grid>
  )
}
