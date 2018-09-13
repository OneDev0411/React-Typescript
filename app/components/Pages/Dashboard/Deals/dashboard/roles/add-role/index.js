import React from 'react'
import { connect } from 'react-redux'

import RoleAgentIntegration from '../agent-integration'
import { ROLE_NAMES, roleName } from '../../../utils/roles'
import Deal from '../../../../../../../models/Deal'
import { BasicDropdown } from 'components/BasicDropdown'
import AddIcon from 'components/SvgIcons/Add/AddIcon'

function getItems(items) {
  return items.map(item => ({ label: roleName(item), value: item }))
}

class AddRole extends React.Component {
  state = {
    isFormOpen: false,
    showRolesMenu: false,
    selectedRole: null
  }

  toggleRolesMenu = () =>
    this.setState(state => ({
      showRolesMenu: !state.showRolesMenu
    }))

  closeDrawer = () =>
    this.setState({
      isFormOpen: false,
      selectedRole: null
    })

  handleSelectRole = item =>
    this.setState({
      isFormOpen: true,
      showRolesMenu: false,
      selectedRole: item.value
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

  itemToString = item => item.label

  render() {
    const { deal } = this.props
    const { isFormOpen, selectedRole } = this.state
    const allowedRoles = this.AllowedRoles

    return (
      <div className="create-new-role">
        <BasicDropdown
          buttonSize={this.props.buttonSize}
          items={getItems(this.Roles)}
          itemToString={this.itemToString}
          onChange={this.handleSelectRole}
          buttonIcon={AddIcon}
          buttonText="Add a Contact"
          disabled={allowedRoles && allowedRoles.length > 0}
        />

        {isFormOpen && (
          <RoleAgentIntegration
            deal={deal}
            allowedRoles={allowedRoles}
            isDoubleEnded={this.isDoubleEnded}
            isPrimaryAgent={['BuyerAgent', 'SellerAgent'].includes(
              selectedRole
            )}
            modalTitle="Add to Deal"
            onHide={this.closeDrawer}
          />
        )}
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
