import React, { useState } from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

import { GridProvider } from 'components/Grid/Table'

import { ListingsDrawer } from './ListingsDrawer'
import { ListTable } from './Table'

import {
  AggregatedAgentInfo,
  AgentSide,
  ListingWithProposedAgent
} from '../types'

interface Props {
  user: IUser
  listing: Nullable<ListingWithProposedAgent>
  agents: Nullable<AggregatedAgentInfo[]>
  isLoading: boolean
}

export default function AgentsGrid({
  user,
  listing,
  agents,
  isLoading
}: Props) {
  const [selectedAgentInfo, setSelectedAgentInfo] = useState<
    Nullable<{ info: AggregatedAgentInfo; side: AgentSide }>
  >(null)

  const onCloseDrawer = () => setSelectedAgentInfo(null)

  const onSelectAgentInfo = (info: AggregatedAgentInfo, side: AgentSide) =>
    setSelectedAgentInfo({ info, side })

  if (agents?.length === 0) {
    return (
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justify="center"
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

      {selectedAgentInfo && (
        <ListingsDrawer
          title={`${selectedAgentInfo.info.agent.full_name}'s Listings`}
          onClose={onCloseDrawer}
          listings={
            selectedAgentInfo.side === 'list-agent'
              ? selectedAgentInfo.info.listingsAsListAgent
              : selectedAgentInfo.info.listingsAsSellingAgent
          }
        />
      )}
    </GridProvider>
  )
}
