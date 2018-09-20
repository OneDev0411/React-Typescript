import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import AddManuallyButton from '../AddManuallyButton'

const propTypes = {
  handleAddManually: PropTypes.func.isRequired
}

const NoContacts = ({ handleAddManually }) => (
  <Flex center column style={{ height: '100%' }}>
    <p style={{ color: '#7f7f7f' }}>You don't have any contacts.</p>
    <AddManuallyButton onClick={handleAddManually} />
  </Flex>
)

NoContacts.propTypes = propTypes

export default NoContacts
