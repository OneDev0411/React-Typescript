import { useState } from 'react'

import {
  Dialog,
  DialogProps,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  makeStyles
} from '@material-ui/core'
import { mdiClose, mdiArrowLeftRight } from '@mdi/js'

import ConnectFacebookPageButton, {
  ConnectFacebookPageButtonProps
} from '@app/components/Pages/Dashboard/Account/components/ConnectFacebookPageButton'
import Logo from '@app/views/components/Logo'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    paper: { maxWidth: 456 },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: theme.spacing(7),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      paddingRight: theme.spacing(1)
    },
    title: { flex: 1 },
    footer: { padding: theme.spacing(2, 3, 3, 3) },
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

type ConnectToInstagramDialogProps = DialogProps &
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

  const handleCancel = () => onClose?.({}, 'escapeKeyDown')

  const handleAuthWindowOpen = () => setIsAuthWindowOpen(true)

  const handleAuthWindowClose = () => setIsAuthWindowOpen(false)

  const handleErrorDialogOpen = () => setIsErrorDialogOpen(true)

  const handleErrorDialogClose = () => setIsErrorDialogOpen(false)

  return (
    <Dialog
      {...dialogProps}
      open={!isErrorDialogOpen && open}
      onClose={!isAuthWindowOpen ? onClose : undefined}
      fullWidth
      classes={{ paper: classes.paper }}
    >
      <Box className={classes.header}>
        <DialogTitle className={classes.title} disableTypography>
          <Typography variant="subtitle1">
            Do you want to connect Instagram to Rechat
          </Typography>
        </DialogTitle>
        <IconButton onClick={handleCancel} disabled={isAuthWindowOpen}>
          <SvgIcon path={mdiClose} />
        </IconButton>
      </Box>
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
          We’re not gonna send anything without your permission. you can manage
          your connected account later in account settings
        </Typography>
      </DialogContent>
      <DialogActions className={classes.footer}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          disabled={isAuthWindowOpen}
        >
          Cancel
        </Button>
        <ConnectFacebookPageButton
          variant="contained"
          color="primary"
          onAuthError={onAuthError}
          onAuthSuccess={onAuthSuccess}
          onAuthWindowOpen={handleAuthWindowOpen}
          onAuthWindowClose={handleAuthWindowClose}
          onErrorDialogOpen={handleErrorDialogOpen}
          onErrorDialogClose={handleErrorDialogClose}
        >
          Continue
        </ConnectFacebookPageButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConnectToInstagramDialog
