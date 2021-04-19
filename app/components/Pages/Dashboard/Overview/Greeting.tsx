import React from 'react'
import { useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { selectUser } from 'selectors/user'
import { Avatar } from 'components/Avatar'

const useStyles = makeStyles(
  () => ({
    headline: {
      fontWeight: 900,
      fontFamily: 'LatoBlack'
    }
  }),
  { name: 'Greeting' }
)

export default function Greeting() {
  const classes = useStyles()
  const user = useSelector(selectUser)

  return (
    <Box display="flex">
      <Avatar size="xxlarge" user={user} />
      <Box
        ml={2}
        display="flex"
        justifyContent="flex-end"
        flexDirection="column"
      >
        <Typography
          variant="h5"
          className={classes.headline}
        >{`Good Morning, ${user.first_name}!`}</Typography>
        <Typography variant="body2" color="textSecondary">
          Here are your stats for today.
        </Typography>
      </Box>
    </Box>
  )
}
