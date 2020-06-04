import React from 'react'
import { Box, Checkbox } from '@material-ui/core'

import { useStyles } from '../../../styles'
import useMediaManagerContext from '../../../hooks/useMediaManagerContext'
import { IMediaItem } from '../../../types'
import { toggleMediaSelection } from '../../../context/actions'

interface Props {
  media: IMediaItem
}

export default function SelectCheckbox({ media }: Props) {
  const classes = useStyles()
  const { dispatch } = useMediaManagerContext()
  const { file, selected } = media

  const handleChange = () => {
    dispatch(toggleMediaSelection(file))
  }

  return (
    <Box className={classes.selectCheckbox}>
      <Checkbox color="secondary" checked={selected} onChange={handleChange} />
    </Box>
  )
}
