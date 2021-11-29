import { Grid, Typography, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'
import { createYearArray } from '../helpers'

export const YearBuiltGroup = ({
  filters,
  defaultFilters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const handleChange = (
    fieldName: keyof typeof defaultFilters,
    newValue: Nullable<number>
  ) => {
    const fieldValue = Number(newValue || 0) || null

    updateFilters({ [fieldName]: fieldValue })
  }

  return (
    <EditorGroup title="Year Built">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item className={classes.filledAutoCompleteWrapper}>
          <Autocomplete
            size="small"
            classes={{ popper: 'u-scrollbar--thinner' }}
            value={filters.minimum_year_built}
            options={createYearArray({ max: filters.maximum_year_built })}
            onChange={(e: any, newValue: Nullable<number>) =>
              handleChange('minimum_year_built', newValue)
            }
            getOptionLabel={option => (option ? option.toString() : 'Any')}
            renderInput={params => (
              <TextField {...params} label="Min" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item className={classes.to}>
          <Typography variant="body1">To</Typography>
        </Grid>
        <Grid item className={classes.filledAutoCompleteWrapper}>
          <Autocomplete
            size="small"
            classes={{ popper: 'u-scrollbar--thinner' }}
            value={filters.maximum_year_built}
            options={createYearArray({ min: filters.minimum_year_built })}
            onChange={(e: any, newValue: Nullable<number>) =>
              handleChange('maximum_year_built', newValue)
            }
            getOptionLabel={option => (option ? option.toString() : 'Any')}
            renderInput={params => (
              <TextField {...params} label="Max" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>
    </EditorGroup>
  )
}
