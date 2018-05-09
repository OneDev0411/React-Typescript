import React from 'react'
import { connect } from 'react-redux'
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

  resetStates = () => this.setState(initialState)

  showContactModal = () => this.setState({ showContactModal: true })

  hideContactModal = () => this.setState({ showContactModal: false })

  showRoleModal = () =>
    this.setState({
      showRoleModal: true,
      showContactModal: false
    })

  onSelectContact = contact =>
    this.setState({
      showRoleModal: true,
      showContactModal: false,
      user: convertContactToRole(contact, this.props.attributeDefs)
    })

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

function mapStateToProps({ contacts }) {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(AddRole)
