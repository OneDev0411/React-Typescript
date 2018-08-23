import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import timeago from 'timeago.js'
import Flex from 'styled-flex-component'

import Avatar from './components/Avatar'
import Chatroom from '../../../Chatroom/Util/chatroom'

import { Title, LastSeen, DeleteButton } from './styled'

import {
  getContactUsers,
  getContactOnlineMeta,
  getAttributeFromSummary
} from '../../../../../../models/contacts/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import { deleteContacts } from '../../../../../../store_actions/contacts'
import { confirmation } from '../../../../../../store_actions/confirmation'

import DeletingMessage from './components/DeletingMessage'
import Stage from '../../../../../../views/components/ContactStage'
import DeleteIcon from '../../../../../../views/components/SvgIcons/DeleteOutline/IconDeleteOutline'
import Tooltip from '../../../../../../views/components/tooltip'

import ActionButton from '../../../../../../views/components/Button/ActionButton'

class Catalog extends React.Component {
  state = {
    isDeleting: false,
    isCreatingRoom: false
  }

  handleOnDelete = () => {
    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: 'Delete Contact',
      onConfirm: () => this.handleDeleteContact(),
      description: 'Are you sure you want to delete this contact?'
    })
  }

  handleDeleteContact = async () => {
    this.setState({
      isDeleting: true
    })

    try {
      await this.props.deleteContacts([this.props.contact.id])

      browserHistory.push('/dashboard/contacts')
    } catch (error) {
      throw error
    } finally {
      this.setState({
        isDeleting: false
      })
    }
  }

  handleOnClickChat = async () => {
    try {
      this.setState({
        isCreatingRoom: true
      })

      const recipients = this.getRecipients()
      const room = await this.props.createRoom(recipients)

      this.setState(
        {
          isCreatingRoom: false
        },
        () => Chatroom.openChat(room)
      )
    } catch (error) {
      throw error
    } finally {
      this.setState({
        isCreatingRoom: false
      })
    }
  }

  getRecipients = () => {
    const { contact } = this.props

    const {
      email: userEmail,
      phone_number: userPhone,
      id: userId
    } = this.props.user

    const {
      summary: { email: contactEmail, phone_number: contactPhone }
    } = contact

    const contactUsersId = getContactUsers(contact).map(user => user.id)

    const users = [userId, ...contactUsersId].filter(i => i)
    const emails = [userEmail, contactEmail].filter(i => i)
    const phone_numbers = [userPhone, contactPhone].filter(i => i)

    const recipients = {
      users,
      emails,
      phone_numbers
    }

    return recipients
  }

  // User  can chat just with contacts which at least has
  // email or phone or user attribute.
  shouldShowChatButton(contact) {
    const {
      summary: { email: contactEmail, phone_number: contactPhone },
      users: contactUsers
    } = contact

    return contactEmail || contactPhone || contactUsers
  }

  render() {
    const { contact } = this.props
    const lastSeen = getContactOnlineMeta(contact)

    if (this.state.isDeleting) {
      return <DeletingMessage />
    }

    return (
      <Flex column center className="c-contact-profile-card">
        <Avatar contact={contact} />

        <Title>{getAttributeFromSummary(contact, 'display_name')}</Title>

        {lastSeen &&
          lastSeen.last_seen_at && (
            <LastSeen>{`last seen ${timeago().format(
              lastSeen.last_seen_at * 1000
            )}${
              lastSeen.last_seen_type ? ` on ${lastSeen.last_seen_type}` : ''
            }`}</LastSeen>
          )}

        <Flex full>
          <Stage
            style={{
              width: 'calc(100% - 57px)'
            }}
            buttonStyle={{
              width: '100%',
              padding: '0 0.5em',
              color: '#17283a',
              background: '#fff',
              borderRadius: '3px',
              border: '1px solid #e1e9ef'
            }}
            contacts={[contact.id]}
          />
          {this.shouldShowChatButton(contact) && (
            <ActionButton
              disabled={this.state.isCreatingRoom}
              onClick={this.handleOnClickChat}
              style={{
                marginLeft: '1em'
              }}
            >
              {this.state.isCreatingRoom ? 'Connecting...' : 'Chat'}
            </ActionButton>
          )}
        </Flex>

        <Tooltip caption="Delete contact">
          <DeleteButton
            color="#8da2b5"
            hoverColor="#2196f3"
            onClick={this.handleOnDelete}
          >
            <DeleteIcon size={24} />
          </DeleteButton>
        </Tooltip>
      </Flex>
    )
  }
}

export default connect(
  ({ user }) => ({ user }),
  {
    confirmation,
    createRoom,
    deleteContacts
  }
)(Catalog)
