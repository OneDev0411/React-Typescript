import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { borderColor } from '../../../../../../../views/utils/colors'
import { Menu } from './Menu'
import { Header, Title } from './styled'

const Container = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 1.5em;

    :after {
      display: block;
      content: '';
      height: 1px;
      width: 52px;
      background-color: ${borderColor};
    }
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
