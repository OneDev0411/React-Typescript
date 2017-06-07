import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'

const Colors = {
  Online: 'green',
  Offline: 'gray',
  Background: 'darkgreen'
}

const UserAvatar = ({
  userId,
  name,
  image,
  state,
  color,
  size = 50,
  borderColor = '#fff',
  showStateIndicator = true
}) => {
  return (
    <div
      style={showStateIndicator ? {position: 'relative', width: `${size}px`} : {}}
    >
      <Avatar
        round
        name={name}
        src={image}
        size={size}
        color={color}
      />
      {
        showStateIndicator &&
        <div
          style={{
            position: 'absolute',
            width: `${size / 4}px`,
            height: `${size / 4}px`,
            backgroundColor: Colors[state] || '#000',
            borderRadius: '100px',
            top: `${size / 25}px`,
            right: `${size / 25}px`,
            border: `${size / 25}px solid ${borderColor}`
          }}
        />
      }
    </div>
  )
}

function mapStateToProps({ chatroom }, ownProps) {
  const { states } = chatroom

  if (!states || ownProps.showStateIndicator === false)
    return {}

  const state = states[ownProps.userId] ? states[ownProps.userId].state : 'Offline'
  return { state }
}

export default (connect(mapStateToProps))(UserAvatar)
