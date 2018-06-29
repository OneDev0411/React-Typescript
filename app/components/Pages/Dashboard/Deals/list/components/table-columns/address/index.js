import React from 'react'
import styled from 'styled-components'

import Deal from '../../../../../../../../models/Deal'

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
`

const Name = styled.div``

function getListingPhoto(deal) {
  const photo = Deal.get.field(deal, 'photo')

  return photo || '/static/images/deals/home.png'
}

const Address = ({ deal, roles }) => {
  const address = Deal.get.address(deal, roles)

  return (
    <Container>
      <Image src={getListingPhoto(deal)} alt="" />
      <Name>{address}</Name>
    </Container>
  )
}

export default Address
