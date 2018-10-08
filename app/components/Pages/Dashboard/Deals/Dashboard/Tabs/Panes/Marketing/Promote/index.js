import React from 'react'

import ActionButton from 'components/Button/ActionButton'
import { CreateOpenHouse } from 'components/open-house/CreateOpenHouse'
import SendDealPromotion from 'components/InstantMarketing/Flows/SendDealPromotion'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'

export default function Promote(props) {
  return (
    <Container>
      <LeftColumn>
        <Title>Marketing Center</Title>
        <Description>Beautiful email collaterals for your listing.</Description>

        <SendDealPromotion deal={props.deal}>Explore</SendDealPromotion>
      </LeftColumn>

      <RightColumn>
        <Image
          style={{
            position: 'absolute',
            bottom: 0
          }}
          src="/static/images/deals/marketing/marketing-center-graphic@3x.png"
          alt=""
        />
      </RightColumn>
    </Container>
  )
}
