import React from 'react'
import { Box, useTheme } from '@material-ui/core'
import { mdiDrag } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useStyles } from '../../../styles'

export default function SortHandle() {
  const theme = useTheme()
  const classes = useStyles()

  return (
    <Box className={classes.sortHandle}>
      <SvgIcon path={mdiDrag} color={theme.palette.common.black} />
    </Box>
  )
}
