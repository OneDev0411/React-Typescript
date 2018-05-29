import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectContacts } from '../../../reducers/contacts/list'
import { getContacts } from '../../../store_actions/contacts'

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
  contacts: PropTypes.arrayOf(PropTypes.shape),
  defaultSearchFilter: PropTypes.string
}

const defaultProps = {
  title: 'Select Contact',
  defaultSearchFilter: ''
}

class SelectContactModal extends React.Component {
  componentDidMount() {
    if (this.props.contacts.length < 2) {
      this.fetchContacts()
    }
  }

  fetchContacts = async () => {
    await this.props.getContacts()
  }

  render() {
    const {
      title,
      isOpen,
      contacts,
      handleOnClose,
      handleAddManually,
      handleSelectedItem,
      defaultSearchFilter
    } = this.props

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
          contacts={contacts}
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
}

SelectContactModal.propTypes = propTypes
SelectContactModal.defaultProps = defaultProps

function mapStateToProps(state) {
  return {
    // loading first 50 contacts in initial load of modal
    contacts: selectContacts(state.contacts.list).slice(0, 50)
  }
}

export default connect(mapStateToProps, { getContacts })(SelectContactModal)
