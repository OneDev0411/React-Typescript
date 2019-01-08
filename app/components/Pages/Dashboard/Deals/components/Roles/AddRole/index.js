import React from 'react'
import { connect } from 'react-redux'

import Deal from 'models/Deal'
import { BasicDropdown } from 'components/BasicDropdown'
import AddIcon from 'components/SvgIcons/Add/AddIcon'

import { ROLE_NAMES, roleName } from '../../../utils/roles'

import RoleAgentIntegration from '../AgentIntegration'

import { Container } from './styled'

class AddRoleForm extends React.Component {
  state = {
    isFormOpen: false,
    selectedRole: null
  }

  closeDrawer = () => {
    this.setState({
      isFormOpen: false,
      selectedRole: null
    })

    if (this.props.onCloseDrawer) {
      this.props.onCloseDrawer()
    }
  }

  handleSelectRole = item =>
    this.setState({
      isFormOpen: true,
      selectedRole: item ? item.value : null
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

  get RoleItems() {
    const { deal_type } = this.props.deal
    const roles = this.AllowedRoles || ROLE_NAMES

    return roles
      .filter(name => {
        if (
          (name === 'BuyerAgent' && deal_type === 'Buying') ||
          (name === 'SellerAgent' && deal_type === 'Selling')
        ) {
          return false
        }

        return true
      })
      .map(name => ({
        label: roleName(name),
        value: name
      }))
  }

  get isDoubleEnded() {
    const enderType = Deal.get.field(this.props.deal, 'ender_type')

    return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(enderType)
  }

  itemToString = item => item.label

  render() {
    const roleItems = this.RoleItems

    if (roleItems.length === 0) {
      return false
    }

    return (
      <Container>
        {this.props.actionRenderer ? (
          this.props.actionRenderer({
            disabled: roleItems.length === 0,
            onClick: this.handleSelectRole
          })
        ) : (
          <BasicDropdown
            fullWidth
            buttonSize={this.props.buttonSize}
            items={roleItems}
            itemToString={this.itemToString}
            onChange={this.handleSelectRole}
            buttonIcon={AddIcon}
            buttonText="Add a new contact"
            disabled={roleItems.length === 0}
          />
        )}

        {this.state.isFormOpen && (
          <RoleAgentIntegration
            deal={this.props.deal}
            onUpsertRole={this.props.onCreateRole}
            allowedRoles={this.AllowedRoles}
            isDoubleEnded={this.isDoubleEnded}
            isPrimaryAgent={['BuyerAgent', 'SellerAgent'].includes(
              this.state.selectedRole
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
