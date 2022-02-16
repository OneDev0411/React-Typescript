import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core'
import { isEqual } from 'underscore'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { DealsListFilters } from '../../types'

import { FilterEditorFooter } from './filterEditorFooter'
import { useStyles } from './styles'

export const PROPERTY_TYPES_ITEMS: Record<
  Exclude<IPropertyType, 'Multi-Family'>,
  string
> = {
  Residential: 'Sale',
  'Residential Lease': 'Lease',
  Commercial: 'Commercial',
  'Lots & Acreage': 'Lots & Acreage'
}

export const PropertyTypeEditor = ({
  filters,
  defaultFilters,
  updateFilters
}: FilterButtonDropDownProp<DealsListFilters>) => {
  const classes = useStyles()

  const toggleValues = (
    currentProperyTypes: IPropertyType[] = [],
    newDealType: IPropertyType
  ) => {
    let toggledProperyTypes: IPropertyType[] = []

    if (currentProperyTypes.includes(newDealType)) {
      toggledProperyTypes = currentProperyTypes.filter(item => {
        return item !== newDealType
      })
    } else {
      toggledProperyTypes = [...currentProperyTypes, newDealType]
    }

    updateFilters({
      property_type: toggledProperyTypes
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <Typography variant="subtitle1" className={classes.title}>
          Property type
        </Typography>
      </Grid>

      {Object.keys(PROPERTY_TYPES_ITEMS).map((type: IPropertyType) => (
        <FormControlLabel
          key={type}
          classes={{
            root: classes.switchControlLabel
          }}
          control={
            <Switch
              checked={filters.property_type?.includes(type) || false}
              className={classes.switchControlButton}
              color="primary"
              name={PROPERTY_TYPES_ITEMS[type]}
              onChange={() => {
                toggleValues(filters.property_type, type)
              }}
              inputProps={{
                'aria-label': `${PROPERTY_TYPES_ITEMS[type]} checkbox`
              }}
            />
          }
          label={
            <Grid container alignItems="center">
              <Typography variant="body1">{`${PROPERTY_TYPES_ITEMS[type]}`}</Typography>
            </Grid>
          }
        />
      ))}
      <FilterEditorFooter
        disabledReset={isEqual(
          filters.property_type,
          defaultFilters.property_type
        )}
        onClickReset={() => {
          updateFilters({ property_type: defaultFilters.property_type })
        }}
      />
    </Grid>
  )
}
