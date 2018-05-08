import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Avatar from './components/Avatar'
import LastSeen from '../../../Chatroom/Rooms/components/last-seen'
import Chatroom from '../../../Chatroom/Util/chatroom'

import { getContactUsers } from '../../../../../../models/contacts/helpers'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import { deleteContacts } from '../../../../../../store_actions/contacts'
import { confirmation } from '../../../../../../store_actions/confirmation'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import ShadowButton from '../../../../../../views/components/Button/ShadowButton'
import TrashIcon from '../../../../../../views/components/SvgIcons/TrashIcon'
import DeletingMessage from './components/DeletingMessage'

class Info extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDeleting: false,
      isCreatingRoom: false
    }

    this.handleOnClickChat = this.handleOnClickChat.bind(this)
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

  async handleDeleteContact() {
    const { contact, deleteContacts } = this.props
    const { id: contactId } = contact

    this.setState({
      isDeleting: true
    })

    try {
      await deleteContacts([contactId])

      browserHistory.push('/dashboard/contacts')
    } catch (error) {
      throw error
    } finally {
      this.setState({
        isDeleting: false
      })
    }
  }

  async handleOnClickChat() {
    const { createRoom } = this.props

    try {
      this.setState({
        isCreatingRoom: true
      })

      const recipients = this.getRecipients()
      const room = await createRoom(recipients)

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
    const { user, contact } = this.props

    const { email: userEmail, phone_number: userPhone, id: userId } = user
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
  // User  can chat just with contacts which at least has email or phone or user attribute.
  shouldShowChatButton(contact) {
    const {
      summary: { email: contactEmail, phone_number: contactPhone },
      users: contactUsers
    } = contact

    return contactEmail || contactPhone || contactUsers
  }
  render() {
    const { isCreatingRoom, isDeleting } = this.state
    const { contact } = this.props
    const displayName = contact.summary.display_name

    if (isDeleting) {
      return <DeletingMessage />
    }

    return (
      <div className="c-contact-info c-contact-profile-card">
        <Avatar contact={contact} />

        <div className="c-contact-info__detail">
          <div className="c-contact-info__name">{displayName}</div>

          <div className="c-contact-info__status">
            {contact.users && <LastSeen user={contact.users[0]} />}
          </div>
          {this.shouldShowChatButton(contact) && (
            <ActionButton
              disabled={isCreatingRoom}
              onClick={this.handleOnClickChat}
              style={{ marginTop: '1em' }}
            >
              {isCreatingRoom ? 'Connecting...' : 'Chat'}
            </ActionButton>
          )}
          <ShadowButton
            style={{
              position: 'absolute',
              top: '1em',
              right: '1em'
            }}
            onClick={this.handleOnDelete}
          >
            <TrashIcon color="#2196f3" size={24} />
          </ShadowButton>
        </div>
      </div>
    )
  }
}

export default connect(({ user }) => ({ user }), {
  confirmation,
  createRoom,
  deleteContacts
})(Info)
