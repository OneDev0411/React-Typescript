import React from 'react'
import Downshift from 'downshift'

import UserAvatar from 'components/Avatar'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import {
  Recipient,
  Title,
  EmailsList,
  EmailItem,
  ArrowIcon,
  DeleteButton
} from '../styled'

export default class RecipientItem extends React.Component {
  state = {
    isMenuOpen: false
  }

  toggleOpenMenu = () => {
    if (Array.isArray(this.props.recipient.emails) === false) {
      return false
    }

    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))
  }

  handleChangeEmail = email => {
    const { input, recipient } = this.props

    const nextRecipient = {
      ...recipient,
      email
    }

    const recipients = input.value.map(item =>
      item.email === recipient.email ? nextRecipient : item
    )

    input.onChange(recipients)
    this.toggleOpenMenu()
  }

  omitRecipient = () =>
    this.props.input.onChange(
      this.props.input.value.filter(
        recipient => recipient.email !== this.props.recipient.email
      )
    )

  render() {
    const { recipient } = this.props

    const hasMultipleEmails = recipient.emails && recipient.emails.length > 1

    return (
      <Recipient hasMultipleEmails={hasMultipleEmails}>
        <UserAvatar
          title={recipient.name}
          image={recipient.avatar}
          size={25}
          style={{
            marginRight: '10px'
          }}
        />

        <div onClick={this.toggleOpenMenu}>
          <Title>{recipient.name}</Title>

          {hasMultipleEmails && (
            <ArrowIcon
              className={`fa fa-angle-${this.state.isMenuOpen ? 'up' : 'down'}`}
            />
          )}
        </div>

        {recipient.readOnly !== true && (
          <DeleteButton size="16px" onClick={this.omitRecipient}>
            <CloseIcon />
          </DeleteButton>
        )}

        <Downshift
          isOpen={this.state.isMenuOpen}
          onOuterClick={() => this.setState({ isMenuOpen: false })}
        >
          {({ isOpen }) => (
            <div>
              {isOpen && (
                <EmailsList>
                  {this.props.recipient.emails.map((email, index) => (
                    <EmailItem
                      key={index}
                      onClick={() => this.handleChangeEmail(email)}
                    >
                      {email}
                    </EmailItem>
                  ))}
                </EmailsList>
              )}
            </div>
          )}
        </Downshift>
      </Recipient>
    )
  }
}
