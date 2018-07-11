import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import IconButton from '../../../../../../../views/components/Button/IconButton'
import EditIcon from '../../../../../../../views/components/SvgIcons/Edit/EditIcon'
import AddIcon from '../../../../../../../views/components/SvgIcons/Add/AddIcon'

import { Container, Header, Title, Body } from './styled'

Section.propTypes = {
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  title: PropTypes.string
}

export function Section(props) {
  return (
    <Container>
      {props.title && (
        <Header>
          <Title>{props.title}</Title>
          <Flex alignCenter>
            {typeof props.onAdd === 'function' && (
              <IconButton onClick={props.onAdd}>
                <AddIcon
                  style={{ fill: '#2196f3', width: '20px', height: '20px' }}
                />
              </IconButton>
            )}
            {typeof props.onEdit === 'function' && (
              <IconButton onClick={props.onEdit} style={{ marginLeft: '1rem' }}>
                <EditIcon
                  style={{ fill: '#2196f3', width: '16px', height: '16px' }}
                />
              </IconButton>
            )}
          </Flex>
        </Header>
      )}
      <Body style={{ padding: '1em 1em 0' }}>{props.children}</Body>
    </Container>
  )
}
