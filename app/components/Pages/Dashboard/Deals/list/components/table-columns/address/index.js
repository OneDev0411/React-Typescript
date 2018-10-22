import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import Deal from '../../../../../../../../models/Deal'
import ALink from '../../../../../../../../views/components/ALink'
import { grey } from '../../../../../../../../views/utils/colors'
import { getStatusColor } from '../../../../../../../../utils/listing'
import IconHome from '../../../../../../../../views/components/SvgIcons/NewHome/IconHome'
import ImageStatus from '../../../../../../../../views/components/ImageStatus'
import openDeal from '../../../../utils/open-deal'

const Container = styled.div`
  display: table;
  position: relative;
  align-self: center;
`

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const Name = styled.div`
  width: calc(100% - 40px - 1.5rem);
  margin-left: 1rem;
`

export const SubAddress = styled.div`
  color: ${grey.A550};
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

const Dot = styled.span`
  margin: 0 0.5rem;
  color: #000000;
`
const IconContainer = styled(Flex)`
  width: 40px;
  height: 40px;
  background-color: #000;
  border-radius: 50%;
  > svg {
    height: 16px;
    width: 16px;
  }
`

const Link = styled(ALink)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-weight: 500;
  margin-top: -4px;
`

const Address = ({ deal }) => {
  const photo = Deal.get.field(deal, 'photo')
  const status = Deal.get.status(deal)

  return (
    <Flex>
      <Container>
        {photo ? (
          <Image src={photo} hasPhoto={photo !== null} alt="" />
        ) : (
          <IconContainer center>
            <IconHome />
          </IconContainer>
        )}
        <ImageStatus statusColor={`#${getStatusColor(status)}`} />
      </Container>

      <Name>
        <Link
          onClick={() => openDeal(deal.id)}
          to={`/dashboard/deals/${deal.id}`}
        >
          {deal.title}
        </Link>
        <SubAddress className="blackHover">
          {status || '-'}
          <Dot>.</Dot>
          {deal.property_type}
        </SubAddress>
      </Name>
    </Flex>
  )
}

export default Address
