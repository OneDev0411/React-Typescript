import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

import { primary } from 'views/utils/colors'

const Item = styled(Link)`
  display: block;
  margin-bottom: 1rem;
  color: #000;

  &.is-active {
    color: ${primary};
    font-weight: 500;
    text-decoration: none;
  }
`

export function ActiveItem(props) {
  return (
    <Item
      to={props.to}
      onlyActiveOnIndex={props.indexed}
      activeClassName="is-active"
    >
      {props.text}
    </Item>
  )
}
