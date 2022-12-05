import { useState } from 'react'

import { Box } from '@material-ui/core'

import { AgentWithStats } from '@app/models/agent-network/get-agents'
import { GridProvider } from 'components/Grid/Table'
import { ZeroState } from 'partials/ZeroState'

import { AgentSide, ListingWithProposedAgent1 } from '../types'

import AgentListingsDrawer from './AgentListingsDrawer'
import { ListTable } from './Table'

interface Props {
  user: IUser
  listing: Nullable<ListingWithProposedAgent1>
  filters: Nullable<AlertFilters>
  agents: Nullable<AgentWithStats[]>
  isLoading: boolean
}

export default function AgentsGrid({
  user,
  listing,
  filters,
  agents,
  isLoading
}: Props) {
  const [selectedAgent, setSelectedAgent] = useState<Nullable<IAgent>>(null)
  const [selectedSide, setSelectedSide] = useState<Nullable<AgentSide>>(null)

  const onCloseDrawer = () => {
    setSelectedAgent(null)
    setSelectedSide(null)
  }

  const onSelectAgentInfo = async (info: AgentWithStats, side: AgentSide) => {
    setSelectedAgent(info)
    setSelectedSide(side)
  }

  if (
    listing &&
    listing.property.address.location.latitude === null &&
    listing.property.address.location.longitude === null
  ) {
    return (
      <Box mt={8}>
        <ZeroState
          imageUrl="/static/images/zero-state/mls-explore.png"
          title="Location Not Found"
          subTitle="The agent network cannot function on a listing without an
          address, please choose another listing."
        />
      </Box>
    )
  }

  if (agents?.length === 0) {
    return (
      <Box mt={8}>
        <ZeroState
          imageUrl="/static/images/zero-state/agents-network.png"
          title="No matching agents found."
          subTitle="You can try and search something else or change the filters."
        />
      </Box>
    )
  }

  return (
    <GridProvider>
      <ListTable
        user={user}
        listing={listing}
        agents={agents}
        isLoading={isLoading}
        onSelectAgentInfo={onSelectAgentInfo}
      />

      {selectedAgent && selectedSide && (
        <AgentListingsDrawer
          title={`${selectedAgent.full_name}'s Listings`}
          onClose={onCloseDrawer}
          filters={
            {
              ...filters,
              agents: [selectedAgent.id]
            } as AlertFilters
          }
          side={selectedSide}
        />
      )}
    </GridProvider>
  )
}
