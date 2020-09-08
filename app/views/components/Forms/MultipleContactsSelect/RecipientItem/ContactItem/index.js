import React from 'react'
import Downshift from 'downshift'

import Flex from 'styled-flex-component'
import { mdiChevronDown, mdiChevronUp, mdiClose } from '@mdi/js'

import { Avatar } from 'components/GeneralAvatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import {
  DeleteButton,
  EmailItem,
  EmailsList,
  Recipient,
  Subtitle,
  Title
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
        <Avatar
          alt={recipient.name}
          url={recipient.avatar}
          style={{
            marginRight: '10px'
          }}
        />

        <div onClick={this.toggleOpenMenu}>
          <Flex alignCenter>
            <div>
              <Title>{recipient.name}</Title>
              <Subtitle>{recipient.email}</Subtitle>
            </div>

            {hasMultipleEmails && (
              <SvgIcon
                leftMargined
                size={muiIconSizes.small}
                path={this.state.isMenuOpen ? mdiChevronUp : mdiChevronDown}
              />
            )}
          </Flex>
        </div>

        {recipient.readOnly !== true && (
          <DeleteButton size="16px" onClick={this.omitRecipient}>
            <SvgIcon path={mdiClose} />
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
