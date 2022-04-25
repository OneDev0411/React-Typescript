import { ACL } from '@app/constants/acl'
import useNotify from '@app/hooks/use-notify'
import { useAcl } from '@app/views/components/Acl/use-acl'

import ConnectFacebookPageButton, {
  FacebookAuthErrorCode
} from '../components/ConnectFacebookPageButton'
import FacebookPageList from '../components/FacebookPageList'

import ConnectedAccountsLayout from './ConnectedAccountsLayout'

interface Props {
  className?: string
}

function ConnectedInstagram({ className }: Props) {
  const notify = useNotify()

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

  return (
    <ConnectedAccountsLayout
      className={className}
      title="Instagram"
      description="Share marketing stuff directly to Instagram"
      action={
        <ConnectFacebookPageButton
          variant="outlined"
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
          size="small"
        >
          Connect Instagram account via Facebook
        </ConnectFacebookPageButton>
      }
    >
      <FacebookPageList />
    </ConnectedAccountsLayout>
  )
}

export default ConnectedInstagram
