import React from 'react'
import { connect } from 'react-redux'

import RoleAgentIntegration from '../agent-integration'
import { ROLE_NAMES, roleName } from '../../../utils/roles'
import Deal from '../../../../../../../models/Deal'
import { BasicDropdown } from 'components/BasicDropdown'
import AddIcon from 'components/SvgIcons/Add/AddIcon'

import { Container } from './styled'

class AddRoleForm extends React.Component {
  state = {
    isFormOpen: false,
    selectedRole: null
  }

  closeDrawer = () =>
    this.setState({
      isFormOpen: false,
      selectedRole: null
    })

  handleSelectRole = item =>
    this.setState({
      isFormOpen: true,
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

  getRoleItems = () =>
    this.Roles.map(item => ({ label: roleName(item), value: item }))

  itemToString = item => item.label

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
    const { deal } = this.props
    const { isFormOpen, selectedRole } = this.state
    const allowedRoles = this.AllowedRoles

    return (
      <Container>
        <BasicDropdown
          buttonSize={this.props.buttonSize}
          items={this.getRoleItems()}
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
      </Container>
    )
  }
}

function mapStateToProps({ contacts }) {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(AddRoleForm)
