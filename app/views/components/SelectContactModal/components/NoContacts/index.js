import React from 'react'
import PropTypes from 'prop-types'
import AddManuallyButton from '../AddManuallyButton'

const propTypes = {
  handleAddManually: PropTypes.func.isRequired
}

const NoContacts = ({ handleAddManually }) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center'
    }}
  >
    <p style={{ fontSize: '1.7rem', color: '#8da2b5' }}>
      You don't have any contacts.
    </p>
    <AddManuallyButton onClick={handleAddManually} />
  </div>
)

NoContacts.propTypes = propTypes

export default NoContacts
