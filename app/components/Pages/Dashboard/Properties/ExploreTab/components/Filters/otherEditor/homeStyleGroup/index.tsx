import { Checkbox, FormControlLabel, FormGroup, Grid } from '@material-ui/core'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { ARCHITECTURAL_STYLES } from '../../../../../constants'
import { EditorGroup } from '../EditorGroup'

export const HomeStyleGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const architecturalStyles = filters.architectural_styles || []

  const architecturalStyleValue = (key: IArchitecturalStyle) => {
    return !!filters.architectural_styles?.find(s => s === key)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      updateFilters({
        architectural_styles: [
          ...new Set([
            ...architecturalStyles,
            event.target.name
          ] as IArchitecturalStyle[])
        ]
      })
    } else {
      updateFilters({
        architectural_styles: [
          ...architecturalStyles.filter(el => el !== event.target.name)
        ]
      })
    }
  }

  const isSelectAll =
    Object.values(ARCHITECTURAL_STYLES).length === architecturalStyles.length

  const onToggleSelectAll = (allSelected: boolean) => {
    if (allSelected) {
      updateFilters({
        architectural_styles: [...Object.values(ARCHITECTURAL_STYLES)]
      })
    } else {
      updateFilters({
        architectural_styles: [
          ...architecturalStyles.filter(
            el => !Object.values(ARCHITECTURAL_STYLES).includes(el)
          )
        ]
      })
    }
  }

  return (
    <EditorGroup
      title="Style of Home"
      hasSelectAll
      isSelectAll={isSelectAll}
      onToggleSelectAll={onToggleSelectAll}
    >
      <FormGroup row>
        {Object.values(ARCHITECTURAL_STYLES).map(key => (
          <Grid item key={key} xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={architecturalStyleValue(key)}
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
