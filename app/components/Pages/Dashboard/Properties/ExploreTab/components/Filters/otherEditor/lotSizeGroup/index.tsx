import { Grid, Typography, TextField } from '@material-ui/core'

import { acresToMeters, metersToAcres } from '@app/utils/listing'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const LotSizeGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({
      [event.target.name]: event.target.value
        ? acresToMeters(Number(event.target.value))
        : null
    })
  }

  const minLotSizeFootage = filters.minimum_lot_square_meters
    ? Math.round(metersToAcres(filters.minimum_lot_square_meters))
    : ''

  const maxLotSizeFootage = filters.maximum_lot_square_meters
    ? Math.round(metersToAcres(filters.maximum_lot_square_meters))
    : ''

  return (
    <EditorGroup title="Lot Size Area (Acre)">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item>
          <TextField
            value={minLotSizeFootage}
            onChange={handleChange}
            name="minimum_lot_square_meters"
            size="small"
            type="number"
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
            value={maxLotSizeFootage}
            onChange={handleChange}
            name="maximum_lot_square_meters"
            size="small"
            type="number"
            placeholder="No Max"
            label="Max"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </EditorGroup>
  )
}
