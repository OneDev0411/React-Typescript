import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'

const Colors = {
  Online: '#35B863',
  Offline: 'gray',
  Background: 'darkgreen'
}

const UserAvatar = ({
  name,
  image,
  state,
  color = '#D4D4D4',
  style,
  size = 50,
  borderColor = '#fff',
  showStateIndicator = true,
  textSizeRatio = 3,
  fgColor
}) => {
  const defaultStyles = showStateIndicator
    ? { position: 'relative', width: `${size}px` }
    : {}

  // normalize name
  let normalizedName = name

  let props

  if (typeof normalizedName === 'number') {
    props = {
      value: normalizedName.toString()
    }
  } else {
    const splitName = name && name.split(' ')

    if (splitName && splitName.length > 2) {
      normalizedName = `${splitName[0]} ${splitName[1]}`
    }

    props = {
      name: normalizedName
    }
  }

  return (
    <div
      className="user-avatar"
      style={{
        ...defaultStyles,
        ...style
      }}
    >
      <Avatar
        round
        {...props}
        src={image}
        size={size}
        color={color}
        textSizeRatio={textSizeRatio}
        fgColor={fgColor}
      />
      {showStateIndicator && (
        <div
          className="user-avatar-indicator"
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
      )}
    </div>
  )
}

function mapStateToProps({ chatroom }, ownProps) {
  const { states } = chatroom

  if (!states || ownProps.showStateIndicator === false) {
    return {}
  }

  const state = states[ownProps.userId]
    ? states[ownProps.userId].state
    : 'Offline'

  return { state }
}

export default connect(mapStateToProps)(UserAvatar)
