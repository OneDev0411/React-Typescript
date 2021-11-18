import React from 'react'

import { AgentWithStats } from '@app/models/agent-network/get-agents'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

import { ListingWithProposedAgent } from '../../types'

import AddToContacts from './AddToContacts'
import { getSelectedAgents } from './get-selected-agents'
import PromoteListing from './PromoteListing'

interface Props {
  user: IUser
  listing: Nullable<ListingWithProposedAgent>
  agents: Nullable<AgentWithStats[]>
}

export function TableActions({ user, listing, agents }: Props) {
  const [state] = useGridContext()

  if (!agents) {
    return null
  }

  const selectedAgents = getSelectedAgents(
    agents,
    state.selection.selectedRowIds
  )

  const selectedAgentsWithEmailAddress = selectedAgents.filter(
    agent => !!agent.email
  )

  return (
    <>
      <AddToContacts user={user} agents={selectedAgents} />
      {listing && (
        <PromoteListing
          user={user}
          listing={listing}
          agents={selectedAgentsWithEmailAddress}
        />
      )}
    </>
  )
}
