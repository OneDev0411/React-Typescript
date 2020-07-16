import React from 'react'
import { Helmet } from 'react-helmet'

import Acl from 'components/Acl'
import StatefulUrlFlow from 'components/InstantMarketing/adapters/StatefulUrl'

export default function MarketingEditor() {
  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>
      <StatefulUrlFlow />
    </Acl.Marketing>
  )
}
