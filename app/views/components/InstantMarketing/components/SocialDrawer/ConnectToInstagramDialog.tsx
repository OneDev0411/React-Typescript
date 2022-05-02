import { useRef, useState } from 'react'

import { DialogContent, Typography, makeStyles } from '@material-ui/core'
import { mdiArrowLeftRight } from '@mdi/js'

import ConnectFacebookPageButton, {
  ConnectFacebookPageButtonProps
} from '@app/components/Pages/Dashboard/Account/components/ConnectFacebookPageButton'
import HowToConnectToInstagramButton from '@app/components/Pages/Dashboard/Account/components/HowToConnectToInstagramButton'
import HowToConnectToInstagramDialog from '@app/components/Pages/Dashboard/Account/components/HowToConnectToInstagramDialog'
import ConfirmationDialog, {
  ConfirmationDialogProps
} from '@app/views/components/ConfirmationDialog'
import Logo from '@app/views/components/Logo'
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

type ConnectToInstagramDialogProps = ConfirmationDialogProps &
  Pick<ConnectFacebookPageButtonProps, 'onAuthError' | 'onAuthSuccess'>

function ConnectToInstagramDialog({
  onAuthError,
  onAuthSuccess,
  onClose,
  open,
  ...dialogProps
}: ConnectToInstagramDialogProps) {
  const classes = useStyles()
  const connectButtonRef = useRef<HTMLButtonElement>(null)

  const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false)

  const handleAuthWindowOpen = () => setIsAuthWindowOpen(true)

  const handleAuthWindowClose = () => setIsAuthWindowOpen(false)

  const handleErrorDialogOpen = () => setIsErrorDialogOpen(true)

  const handleErrorDialogClose = () => setIsErrorDialogOpen(false)

  const openHelpDialog = () => setIsHelpDialogOpen(true)

  const closeHelpDialog = () => setIsHelpDialogOpen(false)

  const handleConnectButton = () => {
    // Wait a bit for the connect dialog to be available and then click on the connect button
    setTimeout(() => connectButtonRef.current?.click(), 500)
  }

  return (
    <>
      <ConfirmationDialog
        {...dialogProps}
        open={!isErrorDialogOpen && !isHelpDialogOpen && open}
        onClose={onClose}
      >
        <ConfirmationDialog.Header
          title="Do you want to connect Instagram to Rechat?"
          closeProps={{ disabled: isAuthWindowOpen }}
        />
        <ConfirmationDialog.Body wrapInDialogContent={false}>
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
              We will not send anything without your permission. Easily manage
              your connected account later in Account Settings.
            </Typography>
          </DialogContent>
        </ConfirmationDialog.Body>
        <ConfirmationDialog.Footer
          cancelLabel="How to connect to Instagram"
          cancelProps={{ disabled: isAuthWindowOpen }}
          onCancel={openHelpDialog}
          keepDialogOpenOnCancel
          renderCancel={props => <HowToConnectToInstagramButton {...props} />}
          confirmLabel="Continue"
          keepDialogOpenOnConfirm
          renderConfirm={props => (
            <ConnectFacebookPageButton
              {...props}
              ref={connectButtonRef}
              onAuthError={onAuthError}
              onAuthSuccess={onAuthSuccess}
              onAuthWindowOpen={handleAuthWindowOpen}
              onAuthWindowClose={handleAuthWindowClose}
              onErrorDialogOpen={handleErrorDialogOpen}
              onErrorDialogClose={handleErrorDialogClose}
            />
          )}
        />
      </ConfirmationDialog>
      <HowToConnectToInstagramDialog
        open={isHelpDialogOpen}
        onConnectClick={handleConnectButton}
        onClose={closeHelpDialog}
      />
    </>
  )
}

export default ConnectToInstagramDialog
