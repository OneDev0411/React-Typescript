import React from 'react'
import { ButtonBase, makeStyles, Theme } from '@material-ui/core'

import IntercomTrigger from '../../Partials/IntercomTrigger'

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

export default function SupportDrawerTrigger() {
  const classes = useStyles()

  return (
    <IntercomTrigger
      render={({ activeIntercom, intercomIsActive }) => (
        <ButtonBase
          className={classes.button}
          onClick={!intercomIsActive ? activeIntercom : () => false}
        >
          Support
        </ButtonBase>
      )}
    />
  )
}
