import React from 'react'

import ActionButton from 'components/Button/ActionButton'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'

export default function OpenHouse({ deal }) {
  return (
    <Container>
      <LeftColumn>
        <Title>Open House</Title>
        <Description>Customize your open house registration.</Description>

        <ActionButton>Add Open House</ActionButton>
      </LeftColumn>

      <RightColumn>
        <Image
          style={{
            position: 'absolute',
            bottom: 0
          }}
          src="/static/images/deals/openhouse/open-house-graphic@3x.png"
          alt=""
        />
      </RightColumn>
    </Container>
  )
}
