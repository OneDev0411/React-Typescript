import React from 'react'
import { useTitle } from 'react-use'

import Acl from 'components/Acl'
import StatefulUrlFlow from 'components/InstantMarketing/adapters/StatefulUrl'

export default function MarketingEditor() {
  useTitle('Marketing | Rechat')

  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <StatefulUrlFlow />
    </Acl.Marketing>
  )
}
