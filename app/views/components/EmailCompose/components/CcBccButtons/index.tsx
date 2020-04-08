import React from 'react'

import Link from '@material-ui/core/Link'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      button: {
        marginLeft: `${theme.spacing(1)}px`
      }
    }),
  { name: 'CcBccButtons' }
)

export function CcBccButtons({ showCc, showBcc, onCcAdded, onBccAdded }) {
  const classes = useStyles()

  return (
    <>
      {showCc && (
        <Link
          color="secondary"
          component="button"
          className={classes.button}
          onClick={onCcAdded}
        >
          Cc
        </Link>
      )}
      {showBcc && (
        <Link
          color="secondary"
          component="button"
          className={classes.button}
          onClick={onBccAdded}
        >
          Bcc
        </Link>
      )}
    </>
  )
}
