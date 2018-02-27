import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import Avatar from 'react-avatar'
import Contact from '../../../../../../models/Contact'
import LastSeen from '../../../Chatroom/Rooms/components/last-seen'
import Chatroom from '../../../Chatroom/Util/chatroom'
import { createRoom } from '../../../../../../store_actions/chatroom/room'

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
      <div className="card contact-info">
        <Avatar
          className="avatar"
          round
          name={Contact.get.name(contact)}
          src={Contact.get.avatar(contact)}
          size={90}
        />

        <div className="detail">
          <div className="name">{Contact.get.name(contact)}</div>

          <div className="status">
            {contact.users && <LastSeen user={contact.users[0]} />}
          </div>

          <Button
            bsStyle="primary"
            disabled={isCreatingRoom}
            onClick={this.handleOnClickChat}
            style={{
              marginTop: '1em',
              padding: '0.25em 1em'
            }}
          >
            {isCreatingRoom ? 'Connecting...' : 'Chat'}
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(({ user }) => ({ user }), { createRoom })(Info)
