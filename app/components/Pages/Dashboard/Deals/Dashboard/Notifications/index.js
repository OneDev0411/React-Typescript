import React, { useState } from 'react'
import Flex from 'styled-flex-component'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import IconButton from 'components/Button/IconButton'

import { Container, Title, Text } from './styled'

function hasNotifications(deal) {
  return (
    Array.isArray(deal.new_notifications) && deal.new_notifications.length > 0
  )
}

export function Notifications(props) {
  const [isOpen, closeNotificaions] = useState(hasNotifications(props.deal))

  const handleClose = () => {
    closeNotificaions(false)

    const notifications = props.deal.new_notifications.filter(
      notification => !notification.room
    )

    if (notifications.length > 0) {
      deleteNotifications(_.pluck(notifications, 'id'))
    }
  }

  if (isOpen === false) {
    return false
  }

  return (
    <Container>
      <Flex justifyBetween alignCenter style={{ marginBottom: '0.5rem' }}>
        <Title>Notifications since your last visit</Title>

        <IconButton size="medium" isFit onClick={handleClose}>
          <CloseIcon
            style={{
              fill: '#000'
            }}
          />
        </IconButton>
      </Flex>

      {props.deal.new_notifications.map(notification => (
        <Text key={notification.id}>{notification.message}</Text>
      ))}
    </Container>
  )
}
