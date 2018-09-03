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
    isModalOpen: false,
    selectedRole: null
  }

  closeModal = () =>
    this.setState({
      isModalOpen: false,
      selectedRole: null
    })

  handleSelectRole = item =>
    this.setState({
      isModalOpen: true,
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
    const { isModalOpen, selectedRole } = this.state
    const { deal, allowedRoles } = this.props

    return (
      <div className="create-new-role">
        <BasicDropdown
          buttonSize={this.props.buttonSize}
          items={getItems(this.Roles)}
          itemToString={this.itemToString}
          onChange={this.handleSelectRole}
          buttonIcon={AddIcon}
          buttonText="Add a Contact"
          disabled={allowedRoles && allowedRoles.length === 0}
        />

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
