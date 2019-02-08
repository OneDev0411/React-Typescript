import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from './Menu'
import { Container, Header, Title } from './styled'

Section.propTypes = {
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  title: PropTypes.string,
  isNew: PropTypes.bool
}

Section.defaultProps = {
  isNew: false
}

export function Section(props) {
  return (
    <Container>
      <Header alignCenter justifyBetween>
        <Title>{props.title}</Title>
        <Menu {...props} />
      </Header>
      <div style={{ padding: props.isNew ? 0 : '0 1.5rem' }}>
        {props.children}
      </div>
    </Container>
  )
}
