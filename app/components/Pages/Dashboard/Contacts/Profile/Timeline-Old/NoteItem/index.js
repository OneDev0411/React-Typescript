import styled from 'styled-components'
import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import SanitizedHtml from 'components/SanitizedHtml'

import Icon from 'components/SvgIcons/Note/IconNote'
import { Divider } from 'components/Divider'

import { Container } from '../CRMTaskItem/styled'

const ItemContainer = styled(Container)`
  cursor: pointer;
`

export const NoteBody = styled.div`
  ul li {
    list-style: initial;
  }
`

export class NoteItem extends React.Component {
  onClick = () => this.props.onClick(this.props.note)

  render() {
    return (
      <ItemContainer onClick={this.onClick}>
        <Flex alignCenter style={{ marginBottom: '2em' }}>
          <Icon style={{ fill: '#E6BF00', marginRight: '0.5em' }} />
          Note
          <Divider margin="0 1em" width="1px" height="1rem" />
          <div style={{ color: '#7f7f7f' }}>
            {fecha.format(
              new Date(this.props.note.created_at * 1000),
              'MMM D, YYYY hh:mm A'
            )}
          </div>
        </Flex>
        <NoteBody>
          <SanitizedHtml html={this.props.note.text} />
        </NoteBody>
      </ItemContainer>
    )
  }
}