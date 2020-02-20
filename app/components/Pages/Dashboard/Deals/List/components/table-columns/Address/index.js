import React from 'react'
import Flex from 'styled-flex-component'

import Deal from 'models/Deal'

import { getStatusColor } from 'utils/listing'
import IconHome from 'components/SvgIcons/NewHome/IconHome'
import Avatar from 'components/Avatar'

import DealSide from '../Side'

import { Container, Name, SubAddress, Dot, IconContainer, Link } from './styled'
import onDealOpened from '../../../../utils/on-deal-opened'

const Address = ({ deal, roles, rowIndex, totalRows }) => {
  const status = Deal.get.status(deal)
  const photo = Deal.get.field(deal, 'photo')

  return (
    <Flex>
      <Container>
        {photo ? (
          <Avatar image={photo} statusColor={`#${getStatusColor(status)}`} />
        ) : (
          <IconContainer center>
            <IconHome />
          </IconContainer>
        )}
      </Container>

      <Name>
        <Link onClick={onDealOpened} to={`/dashboard/deals/${deal.id}`}>
          {deal.title}
        </Link>
        <SubAddress className="hover-color--black">
          {roles && (
            <React.Fragment>
              <Dot>.</Dot>
              <DealSide
                deal={deal}
                roles={roles}
                rowId={rowIndex + 1}
                rowsCount={totalRows}
              />
            </React.Fragment>
          )}
          <Dot>.</Dot>
          {deal.property_type}
        </SubAddress>
      </Name>
    </Flex>
  )
}

export default Address
