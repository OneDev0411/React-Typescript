import React from 'react'

import ActionButton from 'components/Button/ActionButton'
import { CreateOpenHouse } from 'components/open-house/CreateOpenHouse'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'

export default function OpenHouse(props) {
  return (
    <Container>
      <LeftColumn>
        <Title>Open House</Title>
        <Description>Customize your open house registration.</Description>

        <CreateOpenHouse deal={props.deal} user={props.user}>
          <ActionButton>Create Open House</ActionButton>
        </CreateOpenHouse>
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
