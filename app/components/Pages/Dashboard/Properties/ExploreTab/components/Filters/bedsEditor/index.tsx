import { Grid, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { mdiBedKingOutline } from '@mdi/js'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { FilterEditorFooter } from '../filterEditorFooter'
import { useStyles } from '../styles'

import { createBedArray } from './helpers'

export const BedsEditor = ({
  filters,
  updateFilters,
  defaultFilters,
  resultsCount
}: FilterButtonDropDownProp<AlertFilters>) => {
  const classes = useStyles()

  const handleChange = (
    fieldName: keyof typeof defaultFilters,
    newValue: Nullable<number>
  ) => {
    const fieldValue = Number(newValue || 0) || null

    updateFilters({ [fieldName]: fieldValue })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon path={mdiBedKingOutline} size={muiIconSizes.medium} />
        <Typography variant="subtitle1" className={classes.title}>
          Beds
        </Typography>
      </Grid>
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item xs={5}>
          <Autocomplete
            size="small"
            classes={{ popper: 'u-scrollbar--thinner' }}
            value={filters.minimum_bedrooms}
            options={createBedArray({ max: filters.maximum_bedrooms })}
            onChange={(e: any, newValue: Nullable<number>) =>
              handleChange('minimum_bedrooms', newValue)
            }
            getOptionLabel={option => (option ? option.toString() : 'No Min')}
            renderInput={params => (
              <TextField {...params} label="Min" variant="outlined" />
            )}
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
            classes={{ popper: 'u-scrollbar--thinner' }}
            value={filters.maximum_bedrooms}
            options={createBedArray({ min: filters.minimum_bedrooms })}
            onChange={(e: any, newValue: Nullable<number>) =>
              handleChange('maximum_bedrooms', newValue)
            }
            getOptionLabel={option => (option ? option.toString() : 'No Max')}
            renderInput={params => (
              <TextField
                {...params}
                placeholder="No Max"
                label="Max"
                variant="outlined"
              />
            )}
          />
        </Grid>
      </Grid>
      <FilterEditorFooter
        resultCount={resultsCount}
        disabledReset={
          filters.minimum_bedrooms === defaultFilters.minimum_bedrooms &&
          filters.maximum_bedrooms === defaultFilters.maximum_bedrooms
        }
        onClickReset={() => {
          updateFilters({
            minimum_bedrooms: defaultFilters.minimum_bedrooms,
            maximum_bedrooms: defaultFilters.maximum_bedrooms
          })
        }}
      />
    </Grid>
  )
}
