import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey, primary } from '../../../../../../../views/utils/colors'
import IconHome from '../../../../../../../views/components/SvgIcons/NewHome/IconHome'
import ImageStatus from '../../../../../../../views/components/ImageStatus'

const Container = styled.div`
  display: table;
  position: relative;
`
const Image = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
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

const SubAddress = styled.div`
  color: ${grey.A550};
  display: flex;
  font-size: 0.875rem;
`

const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  > a {
    color: #000;

    :hover {
      color: ${primary};
    }
  }
`

export const Address = ({ listing }) => (
  <Flex>
    <Container>
      {listing.cover_image_url ? (
        <Image src={listing.cover_image_url} alt="a listing" />
      ) : (
        <IconContainer center>
          <IconHome />
        </IconContainer>
      )}
      <ImageStatus statusColor={`#${listing.statusColor}`} />
    </Container>
    <Flex
      column
      justifyBetween
      style={{ width: 'calc(100% - 3.5rem)', marginLeft: '1rem' }}
    >
      <Title>
        <Link to={`/dashboard/mls/${listing.id}`}>{listing.address}</Link>
      </Title>
      <SubAddress className="blackHover">{listing.status}</SubAddress>
    </Flex>
  </Flex>
)
