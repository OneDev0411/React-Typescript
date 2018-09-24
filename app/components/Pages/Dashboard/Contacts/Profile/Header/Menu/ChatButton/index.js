import React from 'react'
import { connect } from 'react-redux'

import Chatroom from '../../../../../Chatroom/Util/chatroom'
import { getContactUsers } from '../../../../../../../../models/contacts/helpers'
import { createRoom } from '../../../../../../../../store_actions/chatroom/room'
import ActionButton from '../../../../../../../../views/components/Button/ActionButton'

class ChatButton extends React.Component {
  state = {
    isCreatingRoom: false
  }

  onClick = async () => {
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

    if (!this.shouldShowChatButton(contact)) {
      return null
    }

    return (
      <ActionButton
        appearance="outline"
        disabled={this.state.isCreatingRoom}
        onClick={this.onClick}
      >
        {this.state.isCreatingRoom ? 'Connecting...' : 'Chat'}
      </ActionButton>
    )
  }
}

export default connect(
  ({ user }) => ({ user }),
  {
    createRoom
  }
)(ChatButton)
