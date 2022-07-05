import { useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import { upperFirst } from 'lodash'

import useNotify from '@app/hooks/use-notify'

import ConnectFacebookPageButton, {
  FacebookAuthErrorCode
} from '../components/ConnectFacebookPageButton'
import FacebookPageList from '../components/FacebookPageList'
import HowToConnectToInstagramButton from '../components/HowToConnectToInstagramButton'
import HowToConnectToInstagramDialog from '../components/HowToConnectToInstagramDialog'

import ConnectedAccountsLayout from './ConnectedAccountsLayout'

const useStyles = makeStyles(
  theme => ({
    howToConnectButton: { marginRight: theme.spacing(1) }
  }),
  { name: 'ConnectedInstagram' }
)

interface Props {
  className?: string
}

function ConnectedInstagram({ className }: Props) {
  const classes = useStyles()
  const notify = useNotify()
  const connectButtonRef = useRef<HTMLButtonElement>(null)

  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState<boolean>(false)

  const handleAuthSuccess = () =>
    notify({
      status: 'success',
      message: 'Your Instagram account has been connected'
    })

  const handleAuthError = (
    _: FacebookAuthErrorCode,
    errorMessage: Optional<string>
  ) =>
    notify({
      status: 'error',
      message: errorMessage ? upperFirst(errorMessage) : 'Something went wrong.'
    })

  const openHelpDialog = () => setIsHelpDialogOpen(true)

  const closeHelpDialog = () => setIsHelpDialogOpen(false)

  const handleConnectClick = () => {
    connectButtonRef.current?.click()
  }

  return (
    <>
      <ConnectedAccountsLayout
        className={className}
        title="Instagram"
        description="Share marketing stuff directly to Instagram"
        action={
          <span>
            <HowToConnectToInstagramButton
              className={classes.howToConnectButton}
              onClick={openHelpDialog}
            />
            <ConnectFacebookPageButton
              ref={connectButtonRef}
              variant="outlined"
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
              size="small"
            >
              Connect Instagram account via Facebook
            </ConnectFacebookPageButton>
          </span>
        }
      >
        <FacebookPageList />
      </ConnectedAccountsLayout>
      <HowToConnectToInstagramDialog
        open={isHelpDialogOpen}
        onClose={closeHelpDialog}
        onConnectClick={handleConnectClick}
      />
    </>
  )
}

export default ConnectedInstagram
