import React from 'react'
import SelectContactModal from '../../../../../../views/components/SelectContactModal'
import RoleCrmIntegration from './crm-integration'
import { convertContactToRole } from '../../utils/roles'

const initialState = {
  user: null,
  showRoleModal: false,
  showContactModal: false
}

class AddRole extends React.Component {
  state = initialState

  showRoleModal = () => {
    this.setState({
      showRoleModal: true,
      showContactModal: false
    })
  }

  resetStates = () => {
    this.setState(initialState)
  }

  showContactModal = () => {
    this.setState({ showContactModal: true })
  }

  hideContactModal = () => {
    this.setState({ showContactModal: false })
  }

  onSelectContact = contact => {
    this.setState({
      showRoleModal: true,
      showContactModal: false,
      user: convertContactToRole(contact)
    })
  }

  render() {
    const { user, showRoleModal, showContactModal } = this.state
    const { deal, allowedRoles } = this.props

    return (
      <div>
        <div className="item add-new" onClick={this.showContactModal}>
          <img src="/static/images/deals/contact-add.png" alt="add contact" />

          <div className="name">
            <div style={{ color: '#61778d' }}>Add a Contact</div>
          </div>
        </div>

        <SelectContactModal
          title="Add to Deal"
          isOpen={showContactModal}
          handleAddManually={this.showRoleModal}
          handleOnClose={this.hideContactModal}
          handleSelectedItem={this.onSelectContact}
        />

        <RoleCrmIntegration
          deal={deal}
          user={user}
          modalTitle="Add to Deal"
          isOpen={showRoleModal}
          onHide={this.resetStates}
          allowedRoles={allowedRoles}
        />
      </div>
    )
  }
}

export default AddRole
