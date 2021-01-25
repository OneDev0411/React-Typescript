import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Link } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import fecha from 'fecha'

import { selectUser } from 'selectors/user'
import { Avatar } from 'components/Avatar'

const useStyles = makeStyles(
  (theme: Theme) => ({
    headline: {
      fontWeight: 900,
      fontFamily: 'LatoBlack'
    },
    stepsList: {
      margin: `${theme.spacing(2)}px 0`,
      paddingLeft: '1em'
    }
  }),
  { name: 'Greeting' }
)

export default function Greeting() {
  const classes = useStyles()
  const user = useSelector(selectUser)

  //  const playIntroVideo = () => {}

  return (
    <Box justifyContent="center">
      <Avatar size="xlarge" user={user} disableLazyLoad />
      <Box>
        <Typography
          variant="h3"
          className={classes.headline}
        >{`Welcome, ${user.first_name}.`}</Typography>
        <Typography variant="body2">
          Today is {fecha.format(new Date(), 'dddd, MMMM Do, YYYY')}
        </Typography>
        {/* <Typography variant="h6">Let's get started!</Typography>
        <ol className={classes.stepsList}>
          <li>
            Watch our{' '}
            <Link href="#" onClick={playIntroVideo}>
              introduction video
            </Link>
            .
          </li>
          <li>
            Download our{' '}
            <Link
              href="https://apps.apple.com/us/app/rechat/id974093560"
              target="_blank"
            >
              iOS app
            </Link>
            .
          </li>
          <li>
            Follow some of our basic tasks to learn how to work with Rechat.
          </li>
        </ol> 
        <Typography variant="body1">
          We have prepared some basic tasks for you to get you started on
          working with Rechat.
        </Typography> */}
      </Box>
    </Box>
  )
}
