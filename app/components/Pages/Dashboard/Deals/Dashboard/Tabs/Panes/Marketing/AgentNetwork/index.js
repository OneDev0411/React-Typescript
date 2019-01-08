import React from 'react'

import LinkButton from 'components/Button/LinkButton'

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

        <LinkButton
          appearance="primary"
          to={`/dashboard/deals/${deal.id}/network`}
        >
          View Network
        </LinkButton>
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
