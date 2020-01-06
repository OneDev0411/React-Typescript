import React, { useState } from 'react'
import { Box, Checkbox } from '@material-ui/core'

import { useStyles } from '../../../styles'

export default function SelectCheckbox() {
  const classes = useStyles()

  return (
    <Box className={classes.selectCheckbox}>
      <Checkbox
        color="default"
        inputProps={{ 'aria-label': 'checkbox with default color' }}
      />
    </Box>
  )
}
