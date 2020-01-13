import React from 'react'
import { useDispatch } from 'react-redux'
import { ButtonBase, makeStyles, Theme } from '@material-ui/core'

import { toggleChatbar } from '../../../../../store_actions/chatroom'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    lineHeight: 2,
    fontSize: '1.125rem',
    paddingLeft: '2rem',
    color: theme.palette.secondary.contrastText,

    '&:hover': {
      color: theme.palette.secondary.main
    }
  }
}))

export default function MessageDrawerTrigger() {
  const dispatch = useDispatch()
  const classes = useStyles()

  const openDrawer = () => {
    if (window.location.pathname.includes('/recents/')) {
      return false
    }

    dispatch(toggleChatbar())
  }

  return (
    <ButtonBase className={classes.button} onClick={openDrawer}>
      Messages
    </ButtonBase>
  )
}
