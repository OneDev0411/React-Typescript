import { useRef } from 'react'

import { Grid, Typography, TextField, FormHelperText } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { acresToMeters, metersToAcres } from '@app/utils/listing'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'
import { preventNonNumbricOnKeyDown } from '../helpers'

const CHECK_ERROR_DEBOUNCE_TIME = 500

export const LotSizeGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()
  const validationError = useRef(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validationError.current = false

    updateFilters({
      [event.target.name]: event.target.value
        ? acresToMeters(Number(event.target.value))
        : null
    })
  }

  const minLotSizeAcres = filters.minimum_lot_square_meters
    ? Math.round(metersToAcres(filters.minimum_lot_square_meters))
    : ''

  const maxLotSizeAcres = filters.maximum_lot_square_meters
    ? Math.round(metersToAcres(filters.maximum_lot_square_meters))
    : ''

  const maxError =
    filters.maximum_lot_square_meters && filters.minimum_lot_square_meters
      ? filters.maximum_lot_square_meters <= filters.minimum_lot_square_meters
      : false

  const minError =
    filters.maximum_lot_square_meters && filters.minimum_lot_square_meters
      ? filters.minimum_lot_square_meters >= filters.maximum_lot_square_meters
      : false

  useDebounce(
    () => {
      validationError.current = minError && maxError
    },
    CHECK_ERROR_DEBOUNCE_TIME,
    [
      minError,
      maxError,
      filters.maximum_lot_square_meters,
      filters.minimum_lot_square_meters
    ]
  )

  return (
    <EditorGroup title="Lot Size Area (Acre)">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item>
          <TextField
            value={minLotSizeAcres}
            onKeyDown={preventNonNumbricOnKeyDown}
            onChange={handleChange}
            inputProps={{
              min: 0
            }}
            name="minimum_lot_square_meters"
            size="small"
            type="number"
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
            value={maxLotSizeAcres}
            onKeyDown={preventNonNumbricOnKeyDown}
            onChange={handleChange}
            inputProps={{
              min: 0
            }}
            name="maximum_lot_square_meters"
            size="small"
            type="number"
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
