import { Grid, Typography, TextField } from '@material-ui/core'

import { feetToMeters, metersToFeet } from '@app/utils/listing'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const SquareFootageGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <EditorGroup title="Square Footage">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item>
          <TextField
            value={minSquareFootage}
            size="small"
            type="number"
            name="minimum_square_meters"
            onChange={handleChange}
            placeholder="No Min"
            label="Min"
            variant="outlined"
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
            onChange={handleChange}
            name="maximum_square_meters"
            placeholder="No Max"
            label="Max"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </EditorGroup>
  )
}
