import React from 'react'
import PropTypes from 'prop-types'

import EditButton from '../../../../../../../views/components/Button/IconButton'
import EditIcon from '../../../../../../../views/components/SvgIcons/Edit/EditIcon'

import { Container, Header, Title, Body } from './styled'

Section.propTypes = {
  onEdit: PropTypes.func,
  title: PropTypes.string
}

export function Section(props) {
  return (
    <Container>
      {props.title && (
        <Header>
          <Title>{props.title}</Title>
          {typeof props.onEdit === 'function' && (
            <EditButton onClick={props.onEdit}>
              <EditIcon
                style={{ fill: '#2196f3', width: '16px', height: '16px' }}
              />
            </EditButton>
          )}
        </Header>
      )}
      <Body style={{ padding: '1em 1em 0' }}>{props.children}</Body>
    </Container>
  )
}
