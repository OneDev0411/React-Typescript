import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Link } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

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

  const playIntroVideo = () => {}

  return (
    <Box>
      <Avatar size="xlarge" user={user} />
      <Box>
        <Typography
          variant="h4"
          className={classes.headline}
        >{`Welcome to Rechat, ${user.first_name}.`}</Typography>
        <Typography variant="h6">Let's get started!</Typography>
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
      </Box>
    </Box>
  )
}
