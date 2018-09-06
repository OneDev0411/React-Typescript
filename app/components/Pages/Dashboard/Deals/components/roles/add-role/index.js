import React from 'react'
import { connect } from 'react-redux'
import Downshift from 'downshift'

import RoleAgentIntegration from '../agent-integration'
import { ROLE_NAMES, roleName } from '../../../utils/roles'
import Deal from '../../../../../../../models/Deal'

class AddRole extends React.Component {
  state = {
    isModalOpen: false,
    showRolesMenu: false,
    selectedRole: null
  }

  toggleRolesMenu = () =>
    this.setState(state => ({
      showRolesMenu: !state.showRolesMenu
    }))

  closeModal = () =>
    this.setState({
      isModalOpen: false,
      selectedRole: null
    })

  handleAddNewRole = () => {
    const { allowedRoles } = this.props

    if (!allowedRoles || allowedRoles.length > 0) {
      return this.toggleRolesMenu()
    }
  }

  handleSelectRole = name =>
    this.setState({
      isModalOpen: true,
      selectedRole: name
    })

  get AllowedRoles() {
    const { selectedRole } = this.state
    const { allowedRoles } = this.props

    if (!selectedRole) {
      return allowedRoles
    }

    return Array.isArray(allowedRoles)
      ? [...allowedRoles, selectedRole]
      : [selectedRole]
  }

  get isDoubleEnded() {
    const enderType = Deal.get.field(this.props.deal, 'ender_type')

    return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(enderType)
  }

  get Roles() {
    const { deal_type } = this.props.deal

    return ROLE_NAMES.filter(name => {
      if (
        (name === 'BuyerAgent' && deal_type === 'Buying') ||
        (name === 'SellerAgent' && deal_type === 'Selling')
      ) {
        return false
      }

      return true
    })
  }

  render() {
    const { isModalOpen, selectedRole } = this.state
    const { deal } = this.props

    return (
      <div className="create-new-role">
        <Downshift
          isOpen={this.state.showRolesMenu}
          onOuterClick={this.toggleRolesMenu}
        >
          {({ isOpen }) => (
            <div>
              <div className="item add-new" onClick={this.handleAddNewRole}>
                <img
                  src="/static/images/deals/contact-add.png"
                  alt="add contact"
                />

                <div className="name">
                  <div style={{ color: '#61778d' }}>Add a Contact</div>
                </div>
              </div>

              {isOpen && (
                <div className="deal-roles-menu">
                  <ul>
                    {this.Roles.map((name, index) => (
                      <li
                        key={index}
                        onClick={() => this.handleSelectRole(name)}
                      >
                        {roleName(name)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Downshift>

        <RoleAgentIntegration
          deal={deal}
          allowedRoles={this.AllowedRoles}
          isDoubleEnded={this.isDoubleEnded}
          isPrimaryAgent={['BuyerAgent', 'SellerAgent'].includes(selectedRole)}
          isOpen={isModalOpen}
          modalTitle="Add to Deal"
          onHide={this.closeModal}
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
