import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core'
import { isEqual } from 'underscore'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { DealsListFilters } from '../../types'

import { FilterEditorFooter } from './filterEditorFooter'
import { useStyles } from './styles'

interface Props extends FilterButtonDropDownProp<DealsListFilters> {
  propertyTypesItems: Record<UUID, IDealPropertyType>
}

export const PropertyTypeEditor = ({
  filters,
  defaultFilters,
  updateFilters,
  propertyTypesItems
}: Props) => {
  const classes = useStyles()

  const toggleValues = (
    currentProperyTypes: UUID[] = [],
    newDealType: UUID
  ) => {
    let toggledProperyTypes: UUID[] = []

    if (currentProperyTypes.includes(newDealType)) {
      toggledProperyTypes = currentProperyTypes.filter(item => {
        return item !== newDealType
      })
    } else {
      toggledProperyTypes = [...currentProperyTypes, newDealType]
    }

    updateFilters({
      property_type: toggledProperyTypes.length
        ? toggledProperyTypes
        : undefined
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <Typography variant="subtitle1" className={classes.title}>
          Property type
        </Typography>
      </Grid>

      {Object.keys(propertyTypesItems).map(id => (
        <FormControlLabel
          key={id}
          classes={{
            root: classes.switchControlLabel
          }}
          control={
            <Switch
              checked={filters.property_type?.includes(id) || false}
              className={classes.switchControlButton}
              color="primary"
              name={propertyTypesItems[id].label}
              onChange={() => {
                toggleValues(filters.property_type, id)
              }}
              inputProps={{
                'aria-label': `${propertyTypesItems[id].label} checkbox`
              }}
            />
          }
          label={
            <Grid container alignItems="center">
              <Typography variant="body1">{`${propertyTypesItems[id].label}`}</Typography>
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
