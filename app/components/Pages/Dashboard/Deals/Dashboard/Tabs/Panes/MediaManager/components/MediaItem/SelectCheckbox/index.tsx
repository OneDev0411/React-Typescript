import React, { useContext } from 'react'
import { Box, Checkbox } from '@material-ui/core'

import { useStyles } from '../../../styles'
import { MediaManagerAPI } from '../../../context'
import { IMediaItem } from '../../../types'
import { toggleMediaSelection } from '../../../reducers/actions'

export default function SelectCheckbox(props: IMediaItem) {
  const classes = useStyles()
  const { dispatch } = useContext(MediaManagerAPI)
  const { file } = props

  const handleChange = () => {
    dispatch(toggleMediaSelection(file))
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
