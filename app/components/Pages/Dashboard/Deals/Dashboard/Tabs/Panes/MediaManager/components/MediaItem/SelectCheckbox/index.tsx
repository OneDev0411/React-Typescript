import React, { useContext } from 'react'
import { Box, Checkbox } from '@material-ui/core'

import { useStyles } from '../../../styles'
import { MediaManagerAPI } from '../../../context'
import { IMediaItem } from '../../../types'

export default function SelectCheckbox(props: IMediaItem) {
  const classes = useStyles()
  const api = useContext(MediaManagerAPI)
  const { id } = props

  const handleChange = () => {
    api && api.toggleMediaSelection(id)
  }

  return (
    <Box className={classes.selectCheckbox}>
      <Checkbox
        color="primary"
        inputProps={{ 'aria-label': 'checkbox with default color' }}
        checked={props.selected ? true : false}
        onChange={handleChange}
      />
    </Box>
  )
}
