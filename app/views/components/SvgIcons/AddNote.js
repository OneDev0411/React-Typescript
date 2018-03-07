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

function AddNote({ size, color, style }) {
  return (
    <svg
      width={size}
      fill={color}
      height={size}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M13.498 19.292l3.207 3.208 4.795-4.794-3.208-3.208-4.794 4.794zm-1.244-.17L20 11.377V.5a.5.5 0 0 0-.5-.5H17v4h-2V0h-2v4h-2V0H9v4H7V0H5v4H3V0H.5a.5.5 0 0 0-.5.5v20a.5.5 0 0 0 .5.5h11.152l.475-1.661a.503.503 0 0 1 .127-.217zm-.237 4.24a.498.498 0 0 0 .616.618l3.219-.92-2.916-2.916-.919 3.218zm11.837-8.718l-2.5-2.5a.5.5 0 0 0-.707 0L19 13.791l3.207 3.207 1.646-1.646a.5.5 0 0 0 .001-.708z"
          fill={color}
          fillRule="nonzero"
        />
        <path d="M0 0h24v24H0z" />
      </g>
    </svg>
  )
}

AddNote.propTypes = propTypes
AddNote.defaultProps = defaultProps

export default AddNote
