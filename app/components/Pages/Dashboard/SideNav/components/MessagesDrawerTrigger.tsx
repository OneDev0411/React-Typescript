import React from 'react'
import { useDispatch } from 'react-redux'
import { ButtonBase, makeStyles, Theme } from '@material-ui/core'

import { toggleChatbar } from '../../../../../store_actions/chatroom'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    paddingLeft: theme.spacing(4),
    color: theme.palette.primary.contrastText,
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,

    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

export default function MessageDrawerTrigger() {
  const dispatch = useDispatch()
  const classes = useStyles()

  const openDrawer = () => {
    if (!window.location.pathname.includes('/recents/')) {
      dispatch(toggleChatbar())
    }
  }

  return (
    <ButtonBase className={classes.button} onClick={openDrawer}>
      Messages
    </ButtonBase>
  )
}
