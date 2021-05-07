import { makeStyles } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import LinkIconButton from '../LinkIconButton'

const useStyles = makeStyles(
  theme => ({
    close: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'ShowingCloseButton' }
)

function ShowingCloseButton() {
  const classes = useStyles()

  return (
    <LinkIconButton className={classes.close} to="/dashboard/showings">
      <CloseIcon />
    </LinkIconButton>
  )
}

export default ShowingCloseButton
