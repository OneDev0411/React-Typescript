import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectContacts } from '../../../reducers/contacts/list'
import BareModal from '../BareModal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import AddManuallyButton from './components/AddManuallyButton'
import CancelButton from '../Button/CancelButton'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleAddManually: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  handleOnClose: PropTypes.func.isRequired,
  handleSelectedItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape),
  defaultSearchFilter: PropTypes.string
}

const defaultProps = {
  title: 'Select Contact',
  defaultSearchFilter: ''
}

function SelectContactModal(props) {
  const {
    title,
    isOpen,
    handleOnClose,
    handleAddManually,
    handleSelectedItem,
    defaultSearchFilter
  } = props

  return (
    <BareModal
      isOpen={isOpen}
      contentLabel={title}
      onRequestClose={handleOnClose}
    >
      <Header title={title}>
        {handleAddManually && <AddManuallyButton onClick={handleAddManually} />}
      </Header>
      <Body
        handleAddManually={handleAddManually}
        handleSelectedItem={handleSelectedItem}
        defaultSearchFilter={defaultSearchFilter}
      />
      <Footer>
        <CancelButton onClick={handleOnClose}>Cancel</CancelButton>
      </Footer>
    </BareModal>
  )
}

SelectContactModal.propTypes = propTypes
SelectContactModal.defaultProps = defaultProps

function mapStateToProps({ contacts: { list } }) {
  return {
    contactsList: selectContacts(list)
  }
}

export default connect(mapStateToProps)(SelectContactModal)
