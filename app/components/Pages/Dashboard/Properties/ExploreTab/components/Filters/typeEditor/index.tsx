import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import {
  PROPERTY_TYPES,
  PROPERTY_TYPES_DEFAULT_VALUES
} from '../../../../constants/constants'
import { FilterEditorFooter } from '../filterEditorFooter'
import { useStyles } from '../styles'

export const TypeEditor = ({
  filters,
  updateFilters,
  defaultFilters,
  resultsCount
}: FilterButtonDropDownProp<AlertFilters>) => {
  const classes = useStyles()

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      updateFilters({
        ...PROPERTY_TYPES_DEFAULT_VALUES[event.target.name as IPropertyType]
      })
    } else {
      updateFilters({
        ...PROPERTY_TYPES_DEFAULT_VALUES.Residential
      })
    }
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <Typography variant="subtitle1" className={classes.title}>
          Properties type
        </Typography>
      </Grid>

      {Object.keys(PROPERTY_TYPES).map(propertyType => (
        <FormControlLabel
          key={propertyType}
          classes={{
            root: classes.switchControlLabel
          }}
          control={
            <Switch
              checked={
                filters.property_types &&
                filters.property_types[0] === propertyType
              }
              className={classes.switchControlButton}
              color="primary"
              name={propertyType}
              onChange={handleValueChange}
              inputProps={{ 'aria-label': `${propertyType} checkbox` }}
            />
          }
          label={
            <Grid container alignItems="center">
              <Typography variant="body1">
                {PROPERTY_TYPES[propertyType]}
              </Typography>
            </Grid>
          }
        />
      ))}

      <FilterEditorFooter
        resultCount={resultsCount}
        onClickReset={() => {
          updateFilters({
            property_types: defaultFilters.property_types
          })
        }}
      />
    </Grid>
  )
}
