import React from 'react'
import { Box, Typography, Link } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bold: {
      fontWeight: theme.typography.fontWeightBold
    }
  })
)

export default function Header() {
  const classes = useStyles()

  return (
    <>
      <Typography className={classes.bold}>4 Photos</Typography>
      <Typography variant="body1">
        Drag &amp; Drop or <Link href="#">Upload</Link>
      </Typography>
    </>
  )
}
