import React from 'react'
import { connect } from 'react-redux'
import AddToDealModal from '../../components/AddToDealModal'
import AddRoleModal from './AddRoleModal'
import { getContactsList } from '../../../../../../reducers/contacts/list'

const initialState = {
  fakeRole: null,
  showAddRoleModal: false,
  showAddToDealModal: false
}

class UpsertRole extends React.Component {
  state = initialState

  showAddRoleModal = () => {
    this.setState({
      showAddRoleModal: true,
      showAddToDealModal: false
    })
  }

  closeAddRoleModal = () => {
    this.setState(initialState)
  }

  handleOpenAddToDealModal = () => {
    this.setState({ showAddToDealModal: true })
  }

  handleCloseAddToDealModal = () => {
    this.setState({ showAddToDealModal: false })
  }

  addRoleWithExistingContactHandler = user => {
    const {
      legal_last_name, legal_first_name, last_name, first_name
    } = user

    const fakeRole = {
      legal_first_name: legal_first_name || first_name,
      legal_last_name: legal_last_name || last_name,
      ...user
    }

    this.setState({
      fakeRole,
      showAddRoleModal: true,
      showAddToDealModal: false
    })
  }

  render() {
    const { fakeRole, showAddRoleModal, showAddToDealModal } = this.state
    const { deal, allowedRoles, contactsList } = this.props

    return (
      <div>
        <div className="item add-new" onClick={this.handleOpenAddToDealModal}>
          <img src="/static/images/deals/contact-add.png" alt="add contact" />

          <div className="name">
            <div style={{ color: '#61778d' }}>Add a Contact</div>
          </div>
        </div>

        <AddToDealModal
          isOpen={showAddToDealModal}
          contactsList={contactsList}
          addManuallyHandler={this.showAddRoleModal}
          closeHandler={this.handleCloseAddToDealModal}
          selectedItemHandler={this.addRoleWithExistingContactHandler}
        />

        <AddRoleModal
          deal={deal}
          role={fakeRole}
          isOpen={showAddRoleModal}
          allowedRoles={allowedRoles}
          closeHandler={this.closeAddRoleModal}
        />
      </div>
    )
  }
}

function mapToProps({ contacts }) {
  const contactsList = getContactsList(contacts)

  return {
    contactsList
  }
}

export default connect(mapToProps)(UpsertRole)
