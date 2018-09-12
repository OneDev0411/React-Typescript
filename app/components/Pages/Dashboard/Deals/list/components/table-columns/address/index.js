import React from 'react'
import styled from 'styled-components'

import Deal from '../../../../../../../../models/Deal'
import ALink from '../../../../../../../../views/components/ALink'

const Container = styled.div`
  display: flex;
`

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
`

const Name = styled.div`
  font-weight: 500;
`

const Address = ({ deal }) => {
  const photo = Deal.get.field(deal, 'photo')

  return (
    <Container>
      <Image
        src={photo || '/static/images/deals/home.png'}
        hasPhoto={photo !== null}
        alt=""
      />
      <ALink>{deal.title}</ALink>
    </Container>
  )
}

export default Address
