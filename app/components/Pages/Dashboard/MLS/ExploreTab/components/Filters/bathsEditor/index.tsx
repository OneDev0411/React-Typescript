import { Grid, Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { mdiShower } from '@mdi/js'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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

  const handleChange = (_: unknown, value: Nullable<number>) => {
    const fieldValue = value ? Number(value) : null

    updateFilters({
      minimum_bathrooms: fieldValue
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon size={muiIconSizes.medium} path={mdiShower} />
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
          classes={{
            root: classes.fullToggleButton,
            selected: classes.ToggleButtonSelected
          }}
          value={0}
          aria-label="any bathrooms"
        >
          Any
        </ToggleButton>
        {numbersArray.map(i => (
          <ToggleButton
            classes={{
              root: classes.fullToggleButton,
              selected: classes.ToggleButtonSelected
            }}
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
        disabledReset={
          filters.minimum_bathrooms === defaultFilters.minimum_bathrooms
        }
        onClickReset={() => {
          updateFilters({
            minimum_bathrooms: defaultFilters.minimum_bathrooms
          })
        }}
      />
    </Grid>
  )
}
