import useNotify from '@app/hooks/use-notify'

import ConnectInstagramAccountButton, {
  FacebookAuthErrorCode
} from '../components/ConnectInstagramAccountButton'
import FacebookPageList from '../components/FacebookPageList'

import ConnectedAccountsLayout from './ConnectedAccountsLayout'

interface Props {
  className?: string
}

function ConnectedInstagram({ className }: Props) {
  const notify = useNotify()

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

  return (
    <ConnectedAccountsLayout
      className={className}
      title="Instagram"
      description="Share marketing stuff directly to Instagram"
      action={
        <ConnectInstagramAccountButton
          variant="outlined"
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
        >
          Connect Instagram Account
        </ConnectInstagramAccountButton>
      }
    >
      <FacebookPageList />
    </ConnectedAccountsLayout>
  )
}

export default ConnectedInstagram
