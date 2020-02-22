import React from 'react'

import { getStatus } from 'models/Deal/helpers/context'

interface Props {
  deal: IDeal
}

function Status({ deal }: Props) {
  if (deal.is_draft) {
    return <>Draft</>
  }

  return <>{getStatus(deal)}</>
}

export default Status
