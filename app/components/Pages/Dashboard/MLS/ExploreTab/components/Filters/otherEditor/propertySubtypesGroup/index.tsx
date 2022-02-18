import { useEffect, useState } from 'react'

import { Checkbox, FormControlLabel, FormGroup, Grid } from '@material-ui/core'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { PROPERTY_TYPES_PROPERTY_SUBTYPES } from '../../../../../constants'
import { EditorGroup } from '../EditorGroup'

export const PropertySubtypesGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const propertySubtypes = filters.property_subtypes || []

  const [allProperties, setAllProperties] =
    useState<Nullable<Record<string, IPropertySubtype>>>(null)

  const subtypeValue = (key: IPropertySubtype) => {
    return !!filters.property_subtypes?.find(s => s === key)
  }

  const selectedPropertyType = (filters.property_types as IPropertyType[])[0]

  useEffect(() => {
    setAllProperties(PROPERTY_TYPES_PROPERTY_SUBTYPES[selectedPropertyType])
  }, [selectedPropertyType])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      updateFilters({
        property_subtypes: [
          ...new Set([
            ...propertySubtypes,
            event.target.name
          ] as IPropertySubtype[])
        ]
      })
    } else {
      updateFilters({
        property_subtypes: [
          ...propertySubtypes.filter(el => el !== event.target.name)
        ]
      })
    }
  }

  const isSelectAll =
    !!allProperties &&
    Object.values(allProperties).length === propertySubtypes.length

  const onToggleSelectAll = (allSelected: boolean) => {
    if (allProperties) {
      if (allSelected) {
        updateFilters({
          property_subtypes: [...Object.values(allProperties)]
        })
      } else {
        updateFilters({
          property_subtypes: [
            ...propertySubtypes.filter(
              el => !Object.values(allProperties).includes(el)
            )
          ]
        })
      }
    }
  }

  return (
    <EditorGroup
      title="Property Subtypes"
      hasSelectAll
      isSelectAll={isSelectAll}
      onToggleSelectAll={onToggleSelectAll}
    >
      {allProperties && (
        <FormGroup row>
          {Object.values(allProperties).map(key => (
            <Grid item key={key} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={subtypeValue(key)}
                    onChange={handleChange}
                    name={key}
                  />
                }
                label={key}
              />
            </Grid>
          ))}
        </FormGroup>
      )}
    </EditorGroup>
  )
}
