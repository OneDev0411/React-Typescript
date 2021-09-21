import { Grid, Typography } from '@material-ui/core'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { FilterEditorFooter } from '../filterEditorFooter'
import { useStyles } from '../styles'

const MAX_BATH = 5
const numbersArray = [...Array(MAX_BATH).keys()]

export const BathsEditor = ({
  filters,
  updateFilters,
  defaultFilters,
  resultsCount
}: FilterButtonDropDownProp<AlertFilters>) => {
  const classes = useStyles()

  const handleChange = (event: any, value: Nullable<number>) => {
    const fieldValue = value ? Number(value) : null

    updateFilters({
      minimum_bathrooms: fieldValue
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <BathtubOutlinedIcon />
        <Typography variant="subtitle1" className={classes.title}>
          Baths
        </Typography>
      </Grid>
      <ToggleButtonGroup
        value={filters.minimum_bathrooms || 0}
        className={classes.ToggleButtonGroup}
        exclusive
        aria-label="bathroom"
        onChange={handleChange}
      >
        <ToggleButton
          className={classes.fullToggleButton}
          value={0}
          aria-label="any bathrooms"
        >
          Any
        </ToggleButton>
        {numbersArray.map(i => (
          <ToggleButton
            className={classes.fullToggleButton}
            key={i + 1}
            value={i + 1}
            aria-label={`${i + 1} bathroom(s)`}
          >
            {i + 1}+
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <FilterEditorFooter
        resultCount={resultsCount}
        onClickReset={() => {
          updateFilters({
            minimum_bathrooms: defaultFilters.minimum_bathrooms
          })
        }}
      />
    </Grid>
  )
}
