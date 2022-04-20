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
  groupedProperties: TPropertyGroup
  propertyGroup: TPropertyGroupType[]
  onChangePropertyGroup: (newGroupValues: TPropertyGroupType[]) => void
}

export const PropertyTypeEditor = ({
  filters,
  defaultFilters,
  updateFilters,
  groupedProperties,
  propertyGroup,
  onChangePropertyGroup
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
        return !groupedProperties[changedGroup].some(item => item.id === id)
      })
    } else {
      toggledProperyGroups = [...currentProperyGroups, changedGroup]
      toggledProperyTypes = [
        ...currentProperyTypes,
        ...groupedProperties[changedGroup].map(item => item.id)
      ]
    }

    const newContext: Partial<DealsListFilters> =
      toggledProperyTypes.length !== 1
        ? {
            contexts: {
              ...(filters.contexts?.expiration_date
                ? { expiration_date: filters.contexts.expiration_date }
                : {}),
              ...(filters.contexts?.list_date
                ? { expiration_date: filters.contexts.list_date }
                : {})
            }
          }
        : {
            contexts: filters.contexts ?? {}
          }

    onChangePropertyGroup(toggledProperyGroups)
    updateFilters({
      property_type: toggledProperyTypes,
      ...newContext
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
      const isAllItemsInGroupUnchecked = !groupedProperties[
        changedPropertyTypeGroup
      ].some(item => toggledProperyTypes.includes(item.id))

      // Remove the group if all items are unchecked
      const toggledProperyGroups = isAllItemsInGroupUnchecked
        ? currentProperyGroups.filter(item => item !== changedPropertyTypeGroup)
        : currentProperyGroups

      onChangePropertyGroup(toggledProperyGroups)

      updateFilters({
        property_type: toggledProperyTypes.length
          ? toggledProperyTypes
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

      {Object.keys(groupedProperties).map((item: TPropertyGroupType) => (
        <>
          <FormControlLabel
            key={item}
            classes={{
              root: classes.switchControlLabel
            }}
            control={
              <Switch
                checked={!!propertyGroup.includes(item)}
                className={classes.switchControlButton}
                color="primary"
                name={PROPERTY_GROUPS[item]}
                onChange={() => {
                  toggleGroupValues(propertyGroup, filters.property_type, item)
                }}
                inputProps={{
                  'aria-label': `${PROPERTY_GROUPS[item]} checkbox`
                }}
              />
            }
            label={
              <Grid container alignItems="center">
                <Typography variant="body1">{`${PROPERTY_GROUPS[item]}`}</Typography>
              </Grid>
            }
          />
          <FormGroup row>
            {groupedProperties[item].map(propertyType => (
              <Grid item key={propertyType.id} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!propertyGroup.includes(item)}
                      color="primary"
                      checked={
                        !!filters.property_type?.includes(propertyType.id)
                      }
                      onChange={() => {
                        togglePropertyValues(
                          filters.property_type,
                          propertyGroup,
                          propertyType.id,
                          item
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
          onChangePropertyGroup([])
          updateFilters({
            property_type: defaultFilters.property_type
          })
        }}
      />
    </Grid>
  )
}
