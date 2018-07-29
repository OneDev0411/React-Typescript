import React from 'react'
import styled from 'styled-components'

import Deal from '../../../../../../../../models/Deal'

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Image = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 4px;
  margin-right: 12px;
`

const Name = styled.div`
  font-weight: 500;
`

const Address = ({ deal, roles }) => {
  const photo = Deal.get.field(deal, 'photo')
  const address = Deal.get.shortAddress(deal, roles)

  return (
    <Container>
      <Image
        src={photo || '/static/images/deals/home.png'}
        hasPhoto={photo !== null}
        alt=""
      />
      <Name>{address}</Name>
    </Container>
  )
}

export default Address
