import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'
import Acl from 'components/Acl'
import StatefulUrlFlow from 'components/InstantMarketing/adapters/StatefulUrl'

function MarketingEditor() {
  useTitle('Marketing | Rechat')

  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <StatefulUrlFlow />
    </Acl.Marketing>
  )
}

export default withRouter(MarketingEditor)
