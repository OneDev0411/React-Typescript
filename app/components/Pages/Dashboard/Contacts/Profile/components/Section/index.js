import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { borderColor } from '../../../../../../../views/utils/colors'
import { Menu } from './Menu'
import { Header, Title } from './styled'

const Container = styled.div`
  padding: 1.5rem;

  &:not(:last-of-type) {
    padding-bottom: 0;

    :after {
      margin-top: 1.5em;
      display: block;
      content: '';
      height: 1px;
      width: 3.25rem;
      background-color: ${borderColor};
    }
  }

  &:hover .menu__icon {
    fill: #000 !important;
  }
`

Section.propTypes = {
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  title: PropTypes.string
}

export function Section(props) {
  return (
    <Container>
      <Header alignCenter justifyBetween>
        <Title>{props.title}</Title>
        <Menu {...props} />
      </Header>
      <div>{props.children}</div>
    </Container>
  )
}
