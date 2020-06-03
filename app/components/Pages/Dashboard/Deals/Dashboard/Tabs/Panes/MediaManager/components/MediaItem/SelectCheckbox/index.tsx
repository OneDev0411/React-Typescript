import React from 'react'
import { Box, Checkbox, makeStyles } from '@material-ui/core'

import { useStyles } from '../../../styles'
import useMediaManagerContext from '../../../hooks/useMediaManagerContext'
import { toggleMediaSelection } from '../../../context/actions'

interface Props {
  media: IMediaItem
}

const useCheckboxStyles = makeStyles({
  root: {
    padding: '3px',

    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
})

export default function SelectCheckbox({ media }: Props) {
  const classes = useStyles()
  const checkboxClasses = useCheckboxStyles()

  const { dispatch } = useMediaManagerContext()
  const { id, selected } = media

  const handleChange = () => {
    dispatch(toggleMediaSelection(id))
  }

  return (
    <Box className={classes.selectCheckbox}>
      <Checkbox
        className={checkboxClasses.root}
        color="secondary"
        checked={selected}
        onChange={handleChange}
        disableRipple
      />
    </Box>
  )
}
