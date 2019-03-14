import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { nl2br } from 'utils/nl2br'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import IconButton from 'components/Button/IconButton'

import { clearDealNotifications } from 'actions/deals'

import { Container, Title, Text } from './styled'

class Notifications extends React.Component {
  constructor(props) {
    super(props)

    const unreadNotifications = this.getUnreadNotifications(props.deal)

    this.state = {
      notifications: unreadNotifications,
      isOpen: unreadNotifications.length > 0
    }

    this.acknowledgeNotifications()
  }

  acknowledgeNotifications = () => {
    this.props.clearDealNotifications(this.props.deal)
  }

  getUnreadNotifications = deal =>
    Array.isArray(deal.new_notifications)
      ? deal.new_notifications.filter(
          notification => notification.room === null
        )
      : []

  handleClose = () =>
    this.setState({
      isOpen: false
    })

  render() {
    if (this.state.isOpen === false) {
      return false
    }

    return (
      <Container>
        <Flex justifyBetween alignCenter style={{ marginBottom: '0.5rem' }}>
          <Title>Notifications since your last visit</Title>

          <IconButton size="medium" isFit onClick={this.handleClose}>
            <CloseIcon
              style={{
                fill: '#000'
              }}
            />
          </IconButton>
        </Flex>

        {this.state.notifications.map(notification => (
          <Text
            key={notification.id}
            dangerouslySetInnerHTML={{
              __html: nl2br(notification.message)
            }}
          />
        ))}
      </Container>
    )
  }
}

export default connect(
  null,
  { clearDealNotifications }
)(Notifications)
