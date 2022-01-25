import React from 'react'

import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import fecha from 'fecha'
import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column'
    },
    headline: {
      display: 'flex'
    },
    username: {
      color: theme.palette.primary.main,
      marginLeft: theme.spacing(0.5)
    },
    today: {
      display: 'flex'
    },
    date: {
      marginLeft: theme.spacing(0.25),
      fontWeight: 700
    }
  }),
  { name: 'Greeting' }
)

export function Greeting() {
  const classes = useStyles()
  const user = useSelector(selectUser)

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.headline}>
        <Typography variant="body1">Welcome back,</Typography>
        <Typography
          variant="subtitle1"
          className={classes.username}
        >{` ${user.first_name}!`}</Typography>
      </Box>

      <Box className={classes.today}>
        <Typography variant="caption">Today is</Typography>
        <Typography variant="caption" className={classes.date}>
          {fecha.format(new Date(), 'dddd, MMM DD, YYYY')}
        </Typography>
      </Box>
    </Box>
  )
}
