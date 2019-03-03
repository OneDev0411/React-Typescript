import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from './Menu'
import { Container, Header, Title } from './styled'

Section.propTypes = {
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  showMenu: PropTypes.bool,
  style: PropTypes.shape(),
  title: PropTypes.string
}

Section.defaultProps = {
  showMenu: false,
  style: {}
}

export function Section(props) {
  return (
    <Container>
      <Header alignCenter justifyBetween>
        <Title>{props.title}</Title>
        {props.showMenu && <Menu {...props} />}
      </Header>
      <div style={props.style}>{props.children}</div>
    </Container>
  )
}
