import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography
} from '@material-ui/core'
import { isEqual } from 'underscore'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import {
  DealsListFilters,
  TPropertyGroup,
  TPropertyGroupType
} from '../../types'

import { FilterEditorFooter } from './filterEditorFooter'
import { useStyles } from './styles'

const PROPERTY_GROUPS: Record<TPropertyGroupType, string> = {
  lease: 'Lease',
  sale: 'Sale'
}

interface Props extends FilterButtonDropDownProp<DealsListFilters> {
  propertyGroups: TPropertyGroup
}

export const PropertyTypeEditor = ({
  filters,
  defaultFilters,
  updateFilters,
  propertyGroups
}: Props) => {
  const classes = useStyles()

  const toggleGroupValues = (
    currentProperyGroups: TPropertyGroupType[] = [],
    currentProperyTypes: UUID[] = [],
    changedGroup: TPropertyGroupType
  ) => {
    let toggledProperyGroups: TPropertyGroupType[] = []
    let toggledProperyTypes: UUID[] = []

    if (currentProperyGroups.includes(changedGroup)) {
      toggledProperyGroups = currentProperyGroups.filter(group => {
        // uncheck group by removing it from the list
        return group !== changedGroup
      })
      toggledProperyTypes = currentProperyTypes.filter(id => {
        // uncheck group items by removing it from the list
        return !propertyGroups[changedGroup].some(item => item.id === id)
      })
    } else {
      toggledProperyGroups = [...currentProperyGroups, changedGroup]
      toggledProperyTypes = [
        ...currentProperyTypes,
        ...propertyGroups[changedGroup].map(item => item.id)
      ]
    }

    updateFilters({
      property_group: toggledProperyGroups.length
        ? toggledProperyGroups
        : undefined,
      property_type: toggledProperyTypes.length
        ? toggledProperyTypes
        : undefined
    })
  }

  const togglePropertyValues = (
    currentProperyTypes: UUID[] = [],
    currentProperyGroups: TPropertyGroupType[] = [],
    changedPropertyType: UUID,
    changedPropertyTypeGroup: TPropertyGroupType
  ) => {
    if (currentProperyTypes.includes(changedPropertyType)) {
      const toggledProperyTypes = currentProperyTypes.filter(item => {
        return item !== changedPropertyType
      })

      // check if all items of the group are unchecked
      const isAllItemsInGroupUnchecked = !propertyGroups[
        changedPropertyTypeGroup
      ].some(item => toggledProperyTypes.includes(item.id))

      // Remove the group if all items are unchecked
      const toggledProperyGroups = isAllItemsInGroupUnchecked
        ? currentProperyGroups.filter(item => item !== changedPropertyTypeGroup)
        : currentProperyGroups

      updateFilters({
        property_type: toggledProperyTypes.length
          ? toggledProperyTypes
          : undefined,
        property_group: toggledProperyGroups.length
          ? toggledProperyGroups
          : undefined
      })
    } else {
      updateFilters({
        property_type: [...currentProperyTypes, changedPropertyType]
      })
    }
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <Typography variant="subtitle1" className={classes.title}>
          Property type
        </Typography>
      </Grid>

      {Object.keys(propertyGroups).map((propertyGroup: TPropertyGroupType) => (
        <>
          <FormControlLabel
            key={propertyGroup}
            classes={{
              root: classes.switchControlLabel
            }}
            control={
              <Switch
                checked={!!filters.property_group?.includes(propertyGroup)}
                className={classes.switchControlButton}
                color="primary"
                name={PROPERTY_GROUPS[propertyGroup]}
                onChange={() => {
                  toggleGroupValues(
                    filters.property_group,
                    filters.property_type,
                    propertyGroup
                  )
                }}
                inputProps={{
                  'aria-label': `${PROPERTY_GROUPS[propertyGroup]} checkbox`
                }}
              />
            }
            label={
              <Grid container alignItems="center">
                <Typography variant="body1">{`${PROPERTY_GROUPS[propertyGroup]}`}</Typography>
              </Grid>
            }
          />
          <FormGroup row>
            {propertyGroups[propertyGroup].map(propertyType => (
              <Grid item key={propertyType.id} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={
                        !filters.property_group?.includes(propertyGroup)
                      }
                      color="primary"
                      checked={
                        !!filters.property_type?.includes(propertyType.id)
                      }
                      onChange={() => {
                        togglePropertyValues(
                          filters.property_type,
                          filters.property_group,
                          propertyType.id,
                          propertyGroup
                        )
                      }}
                      name={propertyType.label}
                    />
                  }
                  label={propertyType.label}
                />
              </Grid>
            ))}
          </FormGroup>
        </>
      ))}

      <FilterEditorFooter
        disabledReset={isEqual(
          filters.property_type,
          defaultFilters.property_type
        )}
        onClickReset={() => {
          updateFilters({
            property_group: defaultFilters.property_group,
            property_type: defaultFilters.property_type
          })
        }}
      />
    </Grid>
  )
}
