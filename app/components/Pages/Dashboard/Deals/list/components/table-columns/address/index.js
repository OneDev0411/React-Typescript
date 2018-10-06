import React from 'react'
import styled from 'styled-components'

import Deal from '../../../../../../../../models/Deal'
import ALink from '../../../../../../../../views/components/ALink'
import { grey } from '../../../../../../../../views/utils/colors'
import { getStatusColor } from '../../../../../../../../utils/listing'

const Container = styled.div`
  display: flex;
  position: relative;
`

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
`

const Name = styled.div``

export const SubAddress = styled.div`
  color: ${grey.A550};
  display: flex;
  font-size: 0.875rem;
`

const Status = styled.div`
  margin-left: 1rem;
`

const Address = ({ deal }) => {
  const photo = Deal.get.field(deal, 'photo')
  const status = Deal.get.status(deal)

  return (
    <Container>
      <Image
        src={photo || '/static/images/deals/home.png'}
        hasPhoto={photo !== null}
        alt=""
      />
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: `#${getStatusColor(status)}`,
          borderRadius: '100px',
          bottom: '0px',
          left: '33px'
        }}
      />
      <Name>
        <ALink>{deal.title}</ALink>
        <SubAddress className="blackHover">
          {deal.property_type}
          <Status>{status}</Status>
        </SubAddress>
      </Name>
    </Container>
  )
}

export default Address
