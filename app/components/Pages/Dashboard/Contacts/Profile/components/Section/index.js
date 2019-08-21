import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from './Menu'
import { Container, Header, Title } from './styled'

Section.propTypes = {
  onEdit: PropTypes.func,
  style: PropTypes.shape(),
  title: PropTypes.string,
  children: PropTypes.node
}

Section.defaultProps = {
  style: {}
}

export function Section(props) {
  return (
    <Container>
      <Header alignCenter justifyBetween>
        <Title id={props.title}>{props.title}</Title>
        <Menu onEdit={props.onEdit} />
      </Header>
      <div style={props.style}>{props.children}</div>
    </Container>
  )
}
