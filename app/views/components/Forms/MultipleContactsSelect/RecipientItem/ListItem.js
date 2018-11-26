import React from 'react'

import TagIcon from 'components/SvgIcons/Tag/TagIcon'

import ListIcon from 'components/SvgIcons/List/ListIcon'

import CloseIcon from '../../../SvgIcons/Close/CloseIcon'
import { Recipient, Title, DeleteButton, IconContainer } from './styled'

export default class ListItem extends React.Component {
  omitRecipient = () =>
    this.props.input.onChange(
      this.props.input.value.filter(
        recipient => recipient.email !== this.props.recipient.email
      )
    )

  renderIcon(type) {
    switch (type) {
      case 'tag':
        return (
          <IconContainer center>
            <TagIcon />
          </IconContainer>
        )
      case 'list':
        return (
          <IconContainer center>
            <ListIcon />
          </IconContainer>
        )
      default:
        return null
    }
  }

  render() {
    const { recipient } = this.props

    return (
      <Recipient>
        {this.renderIcon(recipient.type)}

        <div>
          <Title>{recipient.name}</Title>
        </div>

        {recipient.readOnly !== true && (
          <DeleteButton size="16px" onClick={this.omitRecipient}>
            <CloseIcon />
          </DeleteButton>
        )}
      </Recipient>
    )
  }
}
