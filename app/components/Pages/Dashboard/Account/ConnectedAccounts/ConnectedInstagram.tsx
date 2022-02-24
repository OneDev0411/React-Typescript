import { Button } from '@material-ui/core'

import ConnectedInstagramAccounts from '../components/ConnectedInstagramAccounts'

import ConnectedAccountsLayout from './ConnectedAccountsLayout'

interface Props {
  className?: string
}

function ConnectedInstagram({ className }: Props) {
  return (
    <ConnectedAccountsLayout
      className={className}
      title="Instagram"
      description="Share marketing stuff directly to Instagram"
      action={
        <Button variant="outlined" size="small">
          Connect Instagram Account
        </Button>
      }
    >
      <ConnectedInstagramAccounts />
    </ConnectedAccountsLayout>
  )
}

export default ConnectedInstagram
