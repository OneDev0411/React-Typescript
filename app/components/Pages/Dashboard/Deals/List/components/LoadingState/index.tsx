import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
)

export default function Loading() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <LoadingContainer noPaddings />
    </div>
  )
}
