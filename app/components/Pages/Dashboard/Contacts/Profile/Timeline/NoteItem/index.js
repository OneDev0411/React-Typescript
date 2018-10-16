import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import Icon from '../../../../../../../views/components/SvgIcons/Note/IconNote'
import { Divider } from '../../../../../../../views/components/Divider'
import { Container } from '../CRMTaskItem/styled'
import { Title } from '../components/GeneralInfo/styled'

const ItemContainer = Container.extend`
  cursor: pointer;
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
        <Title style={{ margin: 0 }}>{this.props.note.text}</Title>
      </ItemContainer>
    )
  }
}
