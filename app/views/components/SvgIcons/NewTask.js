import React from 'react'
import PropTypes from 'prop-types'

const defaultProps = {
  size: 16,
  color: '#000',
  style: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}

const propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
  color: PropTypes.string
}

function NewTask({ size, color, style }) {
  return (
    <svg
      width={size}
      fill={color}
      height={size}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <defs>
        <path d="M0 0h24v24H0V0z" id="a" />
      </defs>
      <clipPath id="b">
        <use overflow="visible" xlinkHref="#a" />
      </clipPath>
      <path
        clipPath="url(#b)"
        d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"
      />
    </svg>
  )
}

NewTask.propTypes = propTypes
NewTask.defaultProps = defaultProps

export default NewTask
