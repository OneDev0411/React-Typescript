import React from 'react'
import { Grid, Box, TextField } from '@material-ui/core'

import { TemplateVariableType, TemplateVariable } from '../../types'

import { BaseFieldProps } from './types'
import Image from './Image'
import SortableImageList from './SortableImageList'

export default function Field({
  variable,
  onChange
}: BaseFieldProps<TemplateVariableType>) {
  if (variable.type === 'image') {
    return (
      <Image
        variable={variable as TemplateVariable<'image'>}
        onChange={onChange}
      />
    )
  }

  if (variable.type === 'sortableImageList') {
    return (
      <SortableImageList
        variable={variable as TemplateVariable<'sortableImageList'>}
        onChange={onChange}
      />
    )
  }

  return (
    <Grid container item>
      <Box width="100%" py={2}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          label={variable.label}
          value={variable.value ?? ''}
          onChange={e =>
            onChange({
              ...variable,
              value: e.target.value
            })
          }
        />
      </Box>
    </Grid>
  )
}
