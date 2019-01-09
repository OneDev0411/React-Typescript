import React from 'react'
import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export default function({ title, description, ...rest }) {
  return (
    <ItemWrapper {...rest}>
      <ItemTitle>{title}</ItemTitle>
    </ItemWrapper>
  )
}

const ItemWrapper = styled.div`
  font-family: Barlow;
  width: 100%;
  padding: 0.6rem 1rem;
  cursor: pointer;
`

const ItemTitle = styled.div`
  font-size: 0.9rem;

  ${ItemWrapper}:hover & {
    color: ${primary};
  }
`
