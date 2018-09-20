import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../BareModal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import ActionButton from 'components/Button/ActionButton'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleAddManually: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  handleOnClose: PropTypes.func.isRequired,
  handleSelectedItem: PropTypes.func.isRequired,
  defaultSearchFilter: PropTypes.string
}

const defaultProps = {
  title: 'Select Contact',
  defaultSearchFilter: ''
}

function SelectContactModal(props) {
  const { title, handleOnClose, handleAddManually } = props

  return (
    <BareModal
      isOpen={props.isOpen}
      contentLabel={title}
      onRequestClose={handleOnClose}
    >
      <Header title={title}>
        {handleAddManually && (
          <ActionButton onClick={handleAddManually}>
            Add New Contact
          </ActionButton>
        )}
      </Header>
      <Body
        handleSelectedItem={props.handleSelectedItem}
        defaultSearchFilter={props.defaultSearchFilter}
      />
      <Footer>
        <ActionButton appearance="outline" onClick={handleOnClose}>
          Cancel
        </ActionButton>
      </Footer>
    </BareModal>
  )
}

SelectContactModal.propTypes = propTypes
SelectContactModal.defaultProps = defaultProps

export default SelectContactModal
