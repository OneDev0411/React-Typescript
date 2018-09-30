import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey, primary } from '../../../../../../../views/utils/colors'

const Thumbnail = styled.div`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
  border-radius: 3px;
  background-color: ${grey.A200};

  > img {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
`

const Title = styled.div`
  line-height: 1;
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
    <Thumbnail>
      {listing.cover_image_url && (
        <img alt="a listing" src={listing.cover_image_url} />
      )}
    </Thumbnail>
    <Flex column justifyBetween style={{ width: 'calc(100% - 3.5rem)' }}>
      <Title>
        <Link to={`/dashboard/mls/${listing.id}`}>{listing.address}</Link>
      </Title>
      <div style={{ color: `#${listing.statusColor}` }}>{listing.status}</div>
    </Flex>
  </Flex>
)
