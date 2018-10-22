import React from 'react'
import Downshift from 'downshift'

import CloseIcon from '../../../SvgIcons/Close/CloseIcon'
import {
  Recipient,
  Title,
  EmailsList,
  EmailItem,
  ArrowIcon,
  DeleteButton
} from './styled'
import UserAvatar from 'partials/UserAvatar'

export default class RecipientItem extends React.Component {
  state = {
    isMenuOpen: false
  }

  toggleOpenMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))

  handleChangeEmail = email => {
    const { input, recipient } = this.props

    const nextRecipient = {
      ...recipient,
      email
    }

    const recipients = input.value.map(
      item => (item.email === recipient.email ? nextRecipient : item)
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
          color="#000000"
          fgColor="#ffffff"
          showStateIndicator={false}
          name={recipient.name}
          src={recipient.avatar}
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
                  {recipient.emails
                    .filter(email => email !== recipient.email)
                    .map((email, index) => (
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
