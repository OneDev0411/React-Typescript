import React from 'react'
import styled from 'styled-components'

import { primary, disabledBgColor } from 'views/utils/colors'

export default function({ title, description, ...rest }) {
  return (
    <ItemWrapper {...rest}>
      <ItemTitle>{title}</ItemTitle>
      <ItemDescription>{description}</ItemDescription>
    </ItemWrapper>
  )
}

const ItemWrapper = styled.div`
  font-family: Barlow;
  width: 100%;
  padding: 0.6rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${primary};
  }
`

const ItemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;

  ${ItemWrapper}:hover & {
    color: #fff;
  }
`
const ItemDescription = styled.div`
  font-size: 0.8rem;
  padding: 0.3rem 0;
  color: ${disabledBgColor};

  ${ItemWrapper}:hover & {
    color: #fff;
  }
`
