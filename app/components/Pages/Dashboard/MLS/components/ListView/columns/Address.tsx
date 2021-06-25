import React from 'react'
import ButtonBase from '@material-ui/core/ButtonBase'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  btn: {
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

export const Address = ({ address, onClick }) => {
  const classes = useStyles()

  return (
    <ButtonBase className={classes.btn} onClick={onClick}>
      {address}
    </ButtonBase>
  )
}
