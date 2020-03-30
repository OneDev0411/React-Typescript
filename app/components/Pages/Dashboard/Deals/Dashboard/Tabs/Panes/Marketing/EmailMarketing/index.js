import React from 'react'

import SendDealPromotion from 'components/InstantMarketing/adapters/SendDealPromotion'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'

export default function EmailMarketing(props) {
  return (
    <Container style={{ marginBottom: '1.5rem' }}>
      <LeftColumn>
        <Title>Email Marketing</Title>
        <Description>Beautiful email collateral for your listing.</Description>

        <SendDealPromotion
          deal={props.deal}
          mediums="Email"
          buttonProps={{
            color: 'secondary',
            variant: 'contained'
          }}
          types={[
            'OpenHouse',
            'JustSold',
            'ComingSoon',
            'JustListed',
            'PriceImprovement'
          ]}
        >
          Explore
        </SendDealPromotion>
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
