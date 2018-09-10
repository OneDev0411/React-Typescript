import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from './Menu'
import { Header, Title } from './styled'

Section.propTypes = {
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  title: PropTypes.string
}

export function Section(props) {
  return (
    <div>
      <Header alignCenter justifyBetween>
        <Title>{props.title}</Title>
        <Menu {...props} />
      </Header>
      <div>{props.children}</div>
    </div>
  )
}
