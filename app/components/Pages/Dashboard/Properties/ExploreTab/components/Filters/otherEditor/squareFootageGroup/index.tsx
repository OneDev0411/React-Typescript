import { useRef } from 'react'

import { Grid, Typography, TextField, FormHelperText } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { feetToMeters, metersToFeet } from '@app/utils/listing'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'
import { preventNonNumbricOnKeyDown } from '../helpers'

const CHECK_ERROR_DEBOUNCE_TIME = 500

export const SquareFootageGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()
  const validationError = useRef(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validationError.current = false

    updateFilters({
      [event.target.name]: event.target.value
        ? feetToMeters(Number(event.target.value))
        : null
    })
  }

  const minSquareFootage = filters.minimum_square_meters
    ? Math.round(metersToFeet(filters.minimum_square_meters))
    : ''

  const maxSquareFootage = filters.maximum_square_meters
    ? Math.round(metersToFeet(filters.maximum_square_meters))
    : ''

  const maxError =
    filters.maximum_square_meters && filters.minimum_square_meters
      ? filters.maximum_square_meters <= filters.minimum_square_meters
      : false

  const minError =
    filters.maximum_square_meters && filters.minimum_square_meters
      ? filters.minimum_square_meters >= filters.maximum_square_meters
      : false

  useDebounce(
    () => {
      validationError.current = minError && maxError
    },
    CHECK_ERROR_DEBOUNCE_TIME,
    [
      minError,
      maxError,
      filters.maximum_square_meters,
      filters.minimum_square_meters
    ]
  )

  return (
    <EditorGroup title="Square Footage">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item>
          <TextField
            value={minSquareFootage}
            size="small"
            type="number"
            inputProps={{
              min: 0
            }}
            name="minimum_square_meters"
            onKeyDown={preventNonNumbricOnKeyDown}
            onChange={handleChange}
            placeholder="No Min"
            label="Min"
            variant="outlined"
            error={validationError.current}
          />
        </Grid>
        <Grid item>
          <Typography className={classes.to} variant="body1">
            To
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            value={maxSquareFootage}
            size="small"
            type="number"
            inputProps={{
              min: 0
            }}
            onChange={handleChange}
            onKeyDown={preventNonNumbricOnKeyDown}
            name="maximum_square_meters"
            placeholder="No Max"
            label="Max"
            variant="outlined"
            error={validationError.current}
          />
        </Grid>
      </Grid>
      {validationError.current && (
        <FormHelperText error>
          Please enter valid min and max values!
        </FormHelperText>
      )}
    </EditorGroup>
  )
}
