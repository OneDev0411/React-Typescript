import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../BareModal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import AddManuallyButton from './components/AddManuallyButton'
import CancelButton from '../Button/CancelButton'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleAddManually: PropTypes.func,
  handleOnClose: PropTypes.func.isRequired,
  handleSelectedItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape)
}

const defaultProps = {
  title: 'Select Contact'
}

function SelectContactModal(props) {
  const {
    title,
    isOpen,
    handleOnClose,
    handleAddManually,
    handleSelectedItem
  } = props

  return (
    <BareModal
      isOpen={isOpen}
      contentLabel={title}
      onRequestClose={handleOnClose}
    >
      <Header title={title}>
        {handleAddManually && (
          <AddManuallyButton onClick={handleAddManually} />
        )} 
      </Header>
      <Body
        handleAddManually={handleAddManually}
        handleSelectedItem={handleSelectedItem}
      />
      <Footer>
        <CancelButton onClick={handleOnClose}>Cancel</CancelButton>
      </Footer>
    </BareModal>
  )
}

SelectContactModal.propTypes = propTypes
SelectContactModal.defaultProps = defaultProps

export default SelectContactModal
