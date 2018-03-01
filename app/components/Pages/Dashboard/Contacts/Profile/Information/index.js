import React from 'react'
import { connect } from 'react-redux'

import Avatar from './components/Avatar'
import Contact from '../../../../../../models/contacts'
import LastSeen from '../../../Chatroom/Rooms/components/last-seen'
import Chatroom from '../../../Chatroom/Util/chatroom'
import { createRoom } from '../../../../../../store_actions/chatroom/room'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

class Info extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isCreatingRoom: false
    }

    this.handleOnClickChat = this.handleOnClickChat.bind(this)
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
      summary: { email: contactEmail, phone_number: contactPhone },
      users: contactUsers
    } = contact
    const [contactUser] = contactUsers
    const { id: contactUserId } = contactUser

    const users = [userId, contactUserId].filter(i => i)
    const emails = [userEmail, contactEmail].filter(i => i)
    const phone_numbers = [userPhone, contactPhone].filter(i => i)

    const recipients = {
      users,
      emails,
      phone_numbers
    }

    return recipients
  }

  render() {
    const { isCreatingRoom } = this.state
    const { contact } = this.props

    return (
      <div className="c-contact-info c-contact-profile-card">
        <Avatar contact={contact} />

        <div className="c-contact-info__detail">
          <div className="c-contact-info__name">
            {Contact.get.name(contact)}
          </div>

          <div className="c-contact-info__status">
            {contact.users && <LastSeen user={contact.users[0]} />}
          </div>

          <ActionButton
            disabled={isCreatingRoom}
            onClick={this.handleOnClickChat}
            style={{ marginTop: '1em' }}
          >
            {isCreatingRoom ? 'Connecting...' : 'Chat'}
          </ActionButton>
        </div>
      </div>
    )
  }
}

export default connect(({ user }) => ({ user }), { createRoom })(Info)
