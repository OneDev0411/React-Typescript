import React from 'react'

import { Button } from '@material-ui/core'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'

export default function AgentNetworkPane({ deal }) {
  return (
    <Container style={{ marginBottom: '1.5rem' }}>
      <LeftColumn>
        <Title>Agent Network</Title>
        <Description>
          Agent Network provides real-time data on the most active agents
          relevant to your listing to co-broke within the community.
        </Description>

        <Button
          variant="contained"
          color="secondary"
          to={`/dashboard/deals/${deal.id}/marketing/network`}
        >
          View Network
        </Button>
      </LeftColumn>

      <RightColumn>
        <Image
          src="/static/images/deals/agent-network/agent-network-graphic@3x.png"
          alt=""
        />
      </RightColumn>
    </Container>
  )
}
