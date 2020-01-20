import React, { useContext } from 'react'
import { Box, Checkbox } from '@material-ui/core'
import cn from 'classnames'

import IconDragHandle from 'components/SvgIcons/DragHandle/IconDragHandle'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { useStyles } from '../../../styles'
import { MediaManagerAPI } from '../../../context'

export default function SortHandle() {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const { dispatch } = useContext(MediaManagerAPI)

  return (
    <Box className={classes.sortHandle}>
      <IconDragHandle fillColor="#000" className={cn(iconClasses.small)} />
    </Box>
  )
}
