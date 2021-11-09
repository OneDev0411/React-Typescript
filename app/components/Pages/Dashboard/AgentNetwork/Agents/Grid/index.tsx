import { useState } from 'react'

import { Grid, Box, Typography } from '@material-ui/core'

import { AgentWithStats } from '@app/models/agent-network/get-agents'
import { GridProvider } from 'components/Grid/Table'

import { AgentSide, ListingWithProposedAgent } from '../types'

import AgentListingsDrawer from './AgentListingsDrawer'
import { ListTable } from './Table'

interface Props {
  user: IUser
  listing: Nullable<ListingWithProposedAgent>
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

  if (agents?.length === 0) {
    return (
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box my={2}>
          <img
            src="/static/images/contacts/zero-state.svg"
            alt="houston"
            style={{ marginBottom: '1rem' }}
          />
        </Box>
        <Typography variant="h5" align="center">
          No matching agents found. <br />
          You can try and search something else or change the filters.
        </Typography>
      </Grid>
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
