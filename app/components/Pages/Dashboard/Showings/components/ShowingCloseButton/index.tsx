import { makeStyles } from '@material-ui/core'

import { mdiClose } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

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
      <SvgIcon path={mdiClose} />
    </LinkIconButton>
  )
}

export default ShowingCloseButton
