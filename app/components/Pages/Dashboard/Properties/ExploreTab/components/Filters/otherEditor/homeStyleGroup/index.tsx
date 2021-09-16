import { useState } from 'react'

import { Checkbox, FormControlLabel, FormGroup, Grid } from '@material-ui/core'
import { mapValues } from 'lodash'

import { ARCHITECTURAL_STYLES } from '../../../../../constants/constants'
import { EditorGroup } from '../EditorGroup'

export const HomeStyleGroup = () => {
  const [values, setValues] = useState<
    Record<keyof typeof ARCHITECTURAL_STYLES, boolean>
  >(mapValues(ARCHITECTURAL_STYLES, () => false))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.checked }))
  }

  const isSelectAll = Object.values(values).every(Boolean)

  const onToggleSelectAll = (allSelected: boolean) => {
    setValues(prev => mapValues(ARCHITECTURAL_STYLES, () => allSelected))
  }

  return (
    <EditorGroup
      title="Style of Home"
      hasSelectAll
      isSelectAll={isSelectAll}
      onToggleSelectAll={onToggleSelectAll}
    >
      <FormGroup row>
        {Object.keys(ARCHITECTURAL_STYLES).map(key => (
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
              label={ARCHITECTURAL_STYLES[key]}
            />
          </Grid>
        ))}
      </FormGroup>
    </EditorGroup>
  )
}
