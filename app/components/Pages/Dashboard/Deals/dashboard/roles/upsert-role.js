import React from 'react'
import SelectContactModal from '../../../../../../views/components/SelectContactModal'
import AddRoleModal from './AddRoleModal'

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

  handleSelectedContact = contact => {
    const newContact = contact

    delete newContact.id

    const {
      legal_last_name, legal_first_name, last_name, first_name
    } = contact

    const fakeRole = {
      legal_first_name: legal_first_name || first_name,
      legal_last_name: legal_last_name || last_name,
      ...newContact
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

        <SelectContactModal
          title="Add to Deal"
          isOpen={showAddToDealModal}
          handleAddManually={this.showAddRoleModal}
          handleOnClose={this.handleCloseAddToDealModal}
          handleSelectedItem={this.handleSelectedContact}
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

export default UpsertRole
