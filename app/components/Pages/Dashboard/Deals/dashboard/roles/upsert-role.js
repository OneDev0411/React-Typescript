import React from 'react'
import SelectContactModal from '../../../../../../views/components/SelectContactModal'
import AddRoleModal from './add-role-modal'
import { normalizeContactAsRole } from '../../utils/roles'

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
    this.setState({
      showAddRoleModal: true,
      showAddToDealModal: false,
      fakeRole: normalizeContactAsRole(contact)
    })
  }

  render() {
    const { fakeRole, showAddRoleModal, showAddToDealModal } = this.state
    const { deal, allowedRoles } = this.props

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
