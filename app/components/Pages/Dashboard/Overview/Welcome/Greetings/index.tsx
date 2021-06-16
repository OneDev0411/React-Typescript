import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import fecha from 'fecha'

import { selectUser } from 'selectors/user'
import { Avatar } from 'components/Avatar'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      justifyContent: 'center',
      padding: theme.spacing(5),
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    },
    headline: {
      fontWeight: 900,
      fontFamily: 'LatoBlack'
    }
  }),
  { name: 'Greeting' }
)

export function Greeting() {
  const classes = useStyles()
  const user = useSelector(selectUser)

  return (
    <Box className={classes.wrapper}>
      <Avatar size="xlarge" user={user} disableLazyLoad />
      <Box textAlign="center" mt={2}>
        <Typography
          variant="h4"
          className={classes.headline}
        >{`Hello, ${user.first_name}.`}</Typography>
        <Typography variant="body2">
          Today is {fecha.format(new Date(), 'dddd, MMMM Do, YYYY')}
        </Typography>
      </Box>
    </Box>
  )
}
