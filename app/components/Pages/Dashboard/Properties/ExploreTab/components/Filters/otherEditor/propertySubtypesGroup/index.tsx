import { useState } from 'react'

import { Checkbox, FormControlLabel, FormGroup, Grid } from '@material-ui/core'
import { mapValues } from 'lodash'

import { FILTER_PROPERTY_SUBTYPES } from '../../../../../constants/constants'
import { EditorGroup } from '../EditorGroup'

export const PropertySubtypesGroup = () => {
  const [values, setValues] = useState<
    Record<keyof typeof FILTER_PROPERTY_SUBTYPES, boolean>
  >(mapValues(FILTER_PROPERTY_SUBTYPES, () => false))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.checked }))
  }

  const isSelectAll = Object.values(values).every(Boolean)

  const onToggleSelectAll = (allSelected: boolean) => {
    setValues(prev => mapValues(FILTER_PROPERTY_SUBTYPES, () => allSelected))
  }

  return (
    <EditorGroup
      title="Property Subtypes"
      hasSelectAll
      isSelectAll={isSelectAll}
      onToggleSelectAll={onToggleSelectAll}
    >
      <FormGroup row>
        {Object.keys(FILTER_PROPERTY_SUBTYPES).map(key => (
          <Grid item key={key} xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={values[key]}
                  onChange={handleChange}
                  name={key}
                />
              }
              label={FILTER_PROPERTY_SUBTYPES[key]}
            />
          </Grid>
        ))}
      </FormGroup>
    </EditorGroup>
  )
}
