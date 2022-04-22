import { useRef } from 'react'

import { makeStyles } from '@material-ui/core'

import { ACL } from '@app/constants/acl'
import useNotify from '@app/hooks/use-notify'
import { useAcl } from '@app/views/components/Acl/use-acl'

import ConnectFacebookPageButton, {
  FacebookAuthErrorCode
} from '../components/ConnectFacebookPageButton'
import FacebookPageList from '../components/FacebookPageList'
import HowToConnectToInstagramButton from '../components/HowToConnectToInstagramButton'

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

  const hasAccess = useAcl(ACL.SHARE_TO_INSTAGRAM)

  const handleAuthSuccess = () =>
    notify({
      status: 'success',
      message: 'Your Instagram account has been connected'
    })

  const handleAuthError = (errorCode: FacebookAuthErrorCode) =>
    notify({
      status: 'error',
      message: `Something went wrong. errorCode: ${errorCode}`
    })

  if (!hasAccess) {
    return null
  }

  const handleConnectClick = () => {
    connectButtonRef.current?.click()
  }

  return (
    <ConnectedAccountsLayout
      className={className}
      title="Instagram"
      description="Share marketing stuff directly to Instagram"
      action={
        <span>
          <HowToConnectToInstagramButton
            className={classes.howToConnectButton}
            onClick={handleConnectClick}
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
  )
}

export default ConnectedInstagram
