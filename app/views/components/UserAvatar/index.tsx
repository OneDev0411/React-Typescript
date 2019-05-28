import React, { HTMLProps } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import Avatar from 'react-avatar'

const Colors = {
  Online: '#35B863',
  Offline: 'gray',
  Background: 'darkgreen'
}

interface Props {
  name: string | number
  userId?: string
  image?: string
  className?: string
  color?: string
  style?: HTMLProps<HTMLDivElement>['style']
  size?: number
  borderColor?: string
  showStateIndicator?: boolean
  textSizeRatio?: number
  fgColor?: number
  state: string | undefined // make it enum or string union
}

function UserAvatar({
  name,
  image,
  state,
  className,
  color = '#D4D4D4',
  style,
  size = 50,
  borderColor = '#fff',
  showStateIndicator = true,
  textSizeRatio = 3,
  fgColor
}: Props) {
  const defaultStyles: HTMLProps<HTMLDivElement>['style'] = showStateIndicator
    ? { position: 'relative', width: `${size}px` }
    : {}

  // normalize name
  let normalizedName = name

  let props

  if (typeof name === 'number') {
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
      className={cn('user-avatar', className)}
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
            backgroundColor: (state && Colors[state]) || '#000',
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

function mapStateToProps(
  { chatroom },
  ownProps
): { state: string | undefined } {
  const { states } = chatroom

  if (!states || ownProps.showStateIndicator === false) {
    return { state: undefined }
  }

  const state = states[ownProps.userId]
    ? states[ownProps.userId].state
    : 'Offline'

  return { state }
}

export default connect(mapStateToProps)(UserAvatar)
