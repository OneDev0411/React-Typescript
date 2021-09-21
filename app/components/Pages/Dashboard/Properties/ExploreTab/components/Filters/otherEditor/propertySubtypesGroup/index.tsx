import { Checkbox, FormControlLabel, FormGroup, Grid } from '@material-ui/core'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { FILTER_PROPERTY_SUBTYPES } from '../../../../../constants/constants'
import { EditorGroup } from '../EditorGroup'

export const PropertySubtypesGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const propertySubtypes = filters.property_subtypes || []

  const subtypeValue = (key: IPropertySubtype) => {
    return !!filters.property_subtypes?.find(s => s === key)
  }

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
    Object.values(FILTER_PROPERTY_SUBTYPES).length === propertySubtypes.length

  const onToggleSelectAll = (allSelected: boolean) => {
    if (allSelected) {
      updateFilters({
        property_subtypes: [...Object.values(FILTER_PROPERTY_SUBTYPES)]
      })
    } else {
      updateFilters({
        property_subtypes: [
          ...propertySubtypes.filter(
            el => !Object.values(FILTER_PROPERTY_SUBTYPES).includes(el)
          )
        ]
      })
    }
  }

  return (
    <EditorGroup
      title="Property Subtypes"
      hasSelectAll
      isSelectAll={isSelectAll}
      onToggleSelectAll={onToggleSelectAll}
    >
      <FormGroup row>
        {Object.values(FILTER_PROPERTY_SUBTYPES).map(key => (
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
    </EditorGroup>
  )
}
