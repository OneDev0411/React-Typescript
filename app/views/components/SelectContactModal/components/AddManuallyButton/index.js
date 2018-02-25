import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  onClick: PropTypes.func.isRequired
}

function AddManuallyButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        color: '#fff',
        borderWidth: 0,
        padding: '0.25em 0.5em',
        borderRadius: '3px',
        backgroundColor: '#2196f3'
      }}
    >
      Add New Contact
    </button>
  )
}

AddManuallyButton.propTypes = propTypes

export default AddManuallyButton
