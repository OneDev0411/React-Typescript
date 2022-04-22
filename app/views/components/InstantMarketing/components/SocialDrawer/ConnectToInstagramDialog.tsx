import { useState } from 'react'

import { DialogContent, Typography, makeStyles } from '@material-ui/core'
import { mdiArrowLeftRight } from '@mdi/js'

import ConnectFacebookPageButton, {
  ConnectFacebookPageButtonProps
} from '@app/components/Pages/Dashboard/Account/components/ConnectFacebookPageButton'
import Logo from '@app/views/components/Logo'
import ModernDialog, {
  ModernDialogProps
} from '@app/views/components/ModernDialog'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    graphic: {
      padding: theme.spacing(3, 0, 2, 0),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      width: theme.spacing(5),
      height: theme.spacing(5)
    },
    leftRightArrow: {
      color: theme.palette.grey[300],
      margin: theme.spacing(0, 2)
    }
  }),
  { name: 'ConnectToInstagramDialog' }
)

type ConnectToInstagramDialogProps = ModernDialogProps &
  Pick<ConnectFacebookPageButtonProps, 'onAuthError' | 'onAuthSuccess'>

function ConnectToInstagramDialog({
  onAuthError,
  onAuthSuccess,
  onClose,
  open,
  ...dialogProps
}: ConnectToInstagramDialogProps) {
  const classes = useStyles()

  const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)

  const handleAuthWindowOpen = () => setIsAuthWindowOpen(true)

  const handleAuthWindowClose = () => setIsAuthWindowOpen(false)

  const handleErrorDialogOpen = () => setIsErrorDialogOpen(true)

  const handleErrorDialogClose = () => setIsErrorDialogOpen(false)

  return (
    <ModernDialog
      {...dialogProps}
      open={!isErrorDialogOpen && open}
      onClose={!isAuthWindowOpen ? onClose : undefined}
    >
      <ModernDialog.Header title="Do you want to connect Instagram to Rechat?" />
      <ModernDialog.Body wrapInDialogContent={false}>
        <div className={classes.graphic}>
          <Logo
            className={classes.icon}
            fallbackUrl="/static/images/logo--mini.svg"
          />
          <SvgIcon
            className={classes.leftRightArrow}
            path={mdiArrowLeftRight}
            size={muiIconSizes.large}
          />
          <img
            className={classes.icon}
            src="/static/images/instagram-logo.svg"
            alt="Instagram Logo"
          />
        </div>
        <DialogContent>
          <Typography variant="body2">
            We’re not gonna send anything without your permission. you can
            manage your connected account later in account settings
          </Typography>
        </DialogContent>
      </ModernDialog.Body>
      <ModernDialog.Footer
        cancelLabel="Cancel"
        cancelProps={{ disabled: isAuthWindowOpen }}
        confirmLabel="Continue"
        keepDialogOpenOnConfirm
        renderConfirm={props => (
          <ConnectFacebookPageButton
            {...props}
            onAuthError={onAuthError}
            onAuthSuccess={onAuthSuccess}
            onAuthWindowOpen={handleAuthWindowOpen}
            onAuthWindowClose={handleAuthWindowClose}
            onErrorDialogOpen={handleErrorDialogOpen}
            onErrorDialogClose={handleErrorDialogClose}
          />
        )}
      />
    </ModernDialog>
  )
}

export default ConnectToInstagramDialog
