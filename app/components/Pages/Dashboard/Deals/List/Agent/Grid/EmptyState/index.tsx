import { Button } from '@material-ui/core'
import { browserHistory } from 'react-router'

import { ZeroState } from 'partials/ZeroState'

interface Props {
  isSearching?: boolean
}

export default function EmptyState({ isSearching = false }: Props) {
  return (
    <ZeroState
      imageUrl={
        isSearching
          ? '/static/images/zero-state/agents-network.png'
          : '/static/images/zero-state/deals.png'
      }
      title={isSearching ? 'No deals found' : 'You don’t have any deals, yet.'}
      subTitle={
        isSearching
          ? 'Try adjusting your search or create a new deal from scratch.'
          : 'Get started by creating a new listing or making an offer.'
      }
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
