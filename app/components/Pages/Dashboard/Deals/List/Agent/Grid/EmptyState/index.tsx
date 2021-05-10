import { browserHistory } from 'react-router'
import { Button } from '@material-ui/core'

import { ZeroState } from 'partials/ZeroState'

export default function EmptyState() {
  return (
    <ZeroState
      imageUrl="/static/images/zero-state/deals.png"
      title="You don’t have any deals, yet."
      subTitle="Get started by creating a new listing or making an offer."
      ctaNode={
        <Button
          variant="contained"
          color="primary"
          onClick={() => browserHistory.push('/dashboard/deals/create')}
        >
          Create a new deal
        </Button>
      }
    />
  )
}
