import React from 'react'

import TagIcon from 'components/SvgIcons/Tag/TagIcon'
import ListIcon from 'components/SvgIcons/List/ListIcon'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { Recipient, Title, DeleteButton, IconContainer } from '../styled'

export default class ListItem extends React.Component {
  omitRecipient = () =>
    this.props.input.onChange(
      this.props.input.value.filter(
        recipient => recipient.id !== this.props.recipient.id
      )
    )

  renderIcon(type) {
    if (type === 'tag') {
      return (
        <IconContainer center>
          <TagIcon />
        </IconContainer>
      )
    }

    if (type === 'list') {
      return (
        <IconContainer center>
          <ListIcon />
        </IconContainer>
      )
    }

    return null
  }

  render() {
    const { props } = this

    return (
      <Recipient>
        {this.renderIcon(props.recipient.data_type)}

        <div>
          <Title>{props.recipient.name || props.recipient.text}</Title>
        </div>

        {props.recipient.readOnly !== true && (
          <DeleteButton size="16px" onClick={this.omitRecipient}>
            <CloseIcon />
          </DeleteButton>
        )}
      </Recipient>
    )
  }
}
