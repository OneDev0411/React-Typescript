import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    grey: {
      color: theme.palette.grey[700]
    }
  }),
  { name: 'Title' }
)

interface Props {
  title?: string
  subtitle1?: string
  subtitle2?: string
}

function Title({ title, subtitle1, subtitle2 }: Props) {
  const classes = useStyles()

  return (
    <Box pt={5} pb={7} px={3}>
      <Typography color="primary" variant="h5">
        {title}
      </Typography>
      <Typography variant="h6">{subtitle1}</Typography>
      <Typography variant="subtitle2" className={classes.grey}>
        {subtitle2}
      </Typography>
    </Box>
  )
}

export default Title
