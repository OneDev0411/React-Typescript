import React from 'react'
import Downshift from 'downshift'

import CloseIcon from '../../../SvgIcons/Close/CloseIcon'
import IconButton from '../../../Button/IconButton'

import {
  Recipient,
  Title,
  EmailAddress,
  EmailsList,
  EmailItem,
  ArrowIcon
} from './styled'

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
        <IconButton
          size="16px"
          onClick={this.omitRecipient}
          style={{ marginRight: '6px' }}
        >
          <CloseIcon />
        </IconButton>

        <div onClick={this.toggleOpenMenu}>
          <Title>{recipient.name}</Title>
          <EmailAddress>&#60;{recipient.email}&#62;</EmailAddress>

          {hasMultipleEmails && (
            <ArrowIcon
              className={`fa fa-angle-${this.state.isMenuOpen ? 'up' : 'down'}`}
            />
          )}
        </div>

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
