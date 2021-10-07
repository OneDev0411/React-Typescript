import { makeStyles } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import LinkIconButton from '@app/views/components/LinkIconButton'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

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
      <SvgIcon path={mdiClose} />
    </LinkIconButton>
  )
}

export default ShowingCloseButton
