import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import Deal from '../../../../../../../../models/Deal'
import ALink from '../../../../../../../../views/components/ALink'
import { grey } from '../../../../../../../../views/utils/colors'
import { getStatusColor } from '../../../../../../../../utils/listing'
import IconHome from '../../../../../../../../views/components/SvgIcons/NewHome/IconHome'

const Container = styled.div`
  display: flex;
  position: relative;
`

const Image = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`

const Name = styled.div`
  width: calc(100% - 32px - 1.5rem);
  margin-left: 1rem;
`

export const SubAddress = styled.div`
  color: ${grey.A550};
  display: flex;
  font-size: 0.875rem;
`

const Status = styled.div`
  margin-left: 1rem;
`
const IconContainer = styled(Flex)`
  width: 32px;
  height: 32px;
  background-color: #000;
  border-radius: 50%;
  > svg {
    height: 16px;
    width: 16px;
  }
`
const Address = ({ deal }) => {
  const photo = Deal.get.field(deal, 'photo')
  const status = Deal.get.status(deal)

  return (
    <Container>
      {photo ? (
        <Image src={photo} hasPhoto={photo !== null} alt="" />
      ) : (
        <IconContainer center>
          <IconHome />
        </IconContainer>
      )}
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: `#${getStatusColor(status)}`,
          borderRadius: '50%',
          bottom: '13px',
          left: '22px'
        }}
      />
      <Name>
        <ALink
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block'
          }}
        >
          {deal.title}
        </ALink>
        <SubAddress className="blackHover">
          {deal.property_type}
          <Status>{status}</Status>
        </SubAddress>
      </Name>
    </Container>
  )
}

export default Address
