import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

import { primary } from '../../../../../../../views/utils/colors'

const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;

  > a {
    color: #000;

    :hover {
      color: ${primary};
    }
  }
`

export const Address = ({ listing }) => (
  <Title>
    <Link to={`/dashboard/mls/${listing.id}`}>{listing.address}</Link>
  </Title>
)
