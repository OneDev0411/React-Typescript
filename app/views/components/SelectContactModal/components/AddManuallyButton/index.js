import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../Button/ActionButton'

const propTypes = {
  onClick: PropTypes.func.isRequired
}

function AddManuallyButton({ onClick }) {
  return (
    <Button size="small" onClick={onClick}>
      Add New Contact
    </Button>
  )
}

AddManuallyButton.propTypes = propTypes

export default AddManuallyButton
