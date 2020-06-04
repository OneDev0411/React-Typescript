import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import IconHome from '../../../../../../../views/components/SvgIcons/NewHome/IconHome'
import ImageStatus from '../../../../../../../views/components/ImageStatus'

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
const IconContainer = styled(Flex)`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.palette.grey['200']};
  border-radius: 50%;
  > svg {
    fill: ${props => props.theme.palette.grey['500']};
    height: 16px;
    width: 16px;
  }
`

export const Avatar = ({ listing }) => (
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
  </Flex>
)
