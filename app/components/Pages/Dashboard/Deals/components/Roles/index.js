import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Flex from 'styled-flex-component'

import UserAvatar from 'components/Avatar'
import { deleteRole, createRoles } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import IconButton from 'components/Button/IconButton'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import ActionButton from 'components/Button/ActionButton'

import TeamAgents from './AgentIntegration/AgentsList'

import { roleName, getLegalFullName } from '../../utils/roles'
import { getAvatarTitle } from '../../utils/get-avatar-title'
import RoleCrmIntegration from './CrmIntegration'

import AddRole from './AddRole'

import {
  RolesContainer,
  RolesTitle,
  RoleItem,
  RoleAvatar,
  RoleInfo,
  RoleTitle,
  RoleType,
  RoleActions
} from './styled'

class Roles extends React.Component {
  state = {
    user: null,
    deletingRoleId: null,
    isRoleFormOpen: false,
    isReplaceAgentDrawerOpen: false
  }

  isPrimaryAgent = role => {
    const { deal_type } = this.props.deal

    if (
      (deal_type === 'Buying' && role === 'BuyerAgent') ||
      (deal_type === 'Selling' && role === 'SellerAgent')
    ) {
      return true
    }

    return false
  }

  handleRemoveRole = role => {
    this.props.confirmation({
      message: `Remove <b>${role.legal_first_name} ${
        role.legal_last_name
      }</b>?`,
      confirmLabel: 'Yes, remove contact',
      onConfirm: () => this.removeRole(role)
    })
  }

  removeRole = async role => {
    if (this.state.deletingRoleId) {
      return false
    }

    this.setState({
      deletingRoleId: role.id
    })

    try {
      await this.props.deleteRole(this.props.deal.id, role.id)

      if (this.props.onDeleteRole) {
        this.props.onDeleteRole(role)
      }
    } catch (e) {
      this.props.notify({
        message: 'Can not remove the contact from this deal, please try again',
        status: 'error'
      })
    } finally {
      this.setState({
        deletingRoleId: null
      })
    }
  }

  onSelectRole = role => {
    if (!role.email && this.props.isEmailRequired) {
      this.props.onTriggerRequiredEmail()

      return this.props.confirmation({
        message: `${role.legal_first_name} has no email!`,
        description: `Add ${role.legal_first_name}'s email to continue.`,
        confirmLabel: 'Add Email',
        onConfirm: () => this.setSelectedRole(role)
      })
    }

    if (typeof this.props.onSelect === 'function') {
      return this.props.onSelect(role)
    }

    this.setSelectedRole(role)
  }

  closeRoleForm = () => this.setState({ isRoleFormOpen: false, user: null })

  setSelectedRole = user =>
    this.setState({
      user,
      isRoleFormOpen: true
    })

  toggleOpenReplaceAgentDrawer = user =>
    this.setState(state => ({
      user: state.user ? null : user,
      isReplaceAgentDrawerOpen: !state.isReplaceAgentDrawerOpen
    }))

  handleReplaceAgent = async user => {
    const { office, work_phone } = user.agent || {}
    const currentRole = this.state.user

    const role = {
      user: user.id,
      email: user.email,
      legal_last_name: user.last_name,
      legal_first_name: user.first_name,
      phone_number: user.phone_number || work_phone,
      company: office ? office.name : '',
      role: currentRole.role,
      commission_dollar: currentRole.commission_dollar,
      commission_percentage: currentRole.commission_percentage
    }

    await this.removeRole(this.state.user)
    await this.props.createRoles(this.props.deal.id, [role])

    this.toggleOpenReplaceAgentDrawer()

    this.props.notify({
      message: 'Primary Agent replaced',
      status: 'success'
    })
  }

  get AllowedRoles() {
    return this.props.allowedRoles
  }

  get ShowDeleteButton() {
    return !this.state.deletingRoleId && this.props.allowDeleteRole
  }

  render() {
    return (
      <RolesContainer style={this.props.containerStyle}>
        {this.props.showTitle !== false && <RolesTitle>Contacts</RolesTitle>}

        {(this.props.deal.roles || [])
          .filter(
            roleId =>
              this.props.filter(this.props.roles[roleId]) &&
              (!this.props.allowedRoles ||
                this.props.allowedRoles.includes(this.props.roles[roleId].role))
          )
          .map(roleId => {
            const role = this.props.roles[roleId]
            const isPrimaryAgent = this.isPrimaryAgent(role.role)

            return (
              <RoleItem key={role.id} className="item">
                <Flex alignCenter>
                  <RoleAvatar>
                    <UserAvatar
                      size={40}
                      color="#000"
                      title={getAvatarTitle(role)}
                      image={role.user ? role.user.profile_image_url : null}
                    />
                  </RoleAvatar>

                  <RoleInfo onClick={() => this.onSelectRole(role)}>
                    <RoleTitle>{getLegalFullName(role)}</RoleTitle>
                    <RoleType>
                      {roleName(role.role)}
                      {role.user ? ` . ${role.user.email}` : null}
                    </RoleType>
                  </RoleInfo>
                </Flex>

                <RoleActions>
                  {role.id === this.state.deletingRoleId && (
                    <i className="fa fa-spinner fa-spin" />
                  )}

                  {this.ShowDeleteButton && !isPrimaryAgent && (
                    <IconButton
                      appearance="icon"
                      inverse
                      onClick={() => this.handleRemoveRole(role)}
                      style={{ padding: 0, marginLeft: '0.5rem' }}
                      className="delete-button"
                    >
                      <CloseIcon />
                    </IconButton>
                  )}

                  {this.ShowDeleteButton && isPrimaryAgent && (
                    <ActionButton
                      appearance="outline"
                      size="small"
                      style={{ marginLeft: '0.5rem' }}
                      onClick={() => this.toggleOpenReplaceAgentDrawer(role)}
                    >
                      Replace
                    </ActionButton>
                  )}
                </RoleActions>
              </RoleItem>
            )
          })}

        {this.props.disableAddRole === false && (
          <AddRole
            isEmailRequired={this.props.isEmailRequired}
            actionRenderer={this.props.addRoleActionRenderer}
            deal={this.props.deal}
            allowedRoles={this.AllowedRoles}
            onCreateRole={this.props.onCreateRole}
            onCloseDrawer={this.props.onCloseAddRoleDrawer}
          />
        )}

        {this.state.isRoleFormOpen && (
          <RoleCrmIntegration
            isOpen
            deal={this.props.deal}
            role={this.state.user}
            modalTitle="Update Contact"
            isEmailRequired={this.props.isEmailRequired}
            allowedRoles={this.props.allowedRoles}
            onUpsertRole={this.props.onUpsertRole}
            onHide={this.closeRoleForm}
          />
        )}

        {this.state.isReplaceAgentDrawerOpen && (
          <TeamAgents
            isPrimaryAgent
            title="Select New Primary Agent"
            onSelectAgent={this.handleReplaceAgent}
            onClose={this.toggleOpenReplaceAgentDrawer}
          />
        )}
      </RolesContainer>
    )
  }
}

Roles.propsTypes = {
  disableAddRole: PropTypes.bool,
  allowDeleteRole: PropTypes.bool,
  isEmailRequired: PropTypes.bool,
  filter: PropTypes.func,
  addRoleActionRenderer: PropTypes.func,
  onCloseAddRoleDrawer: PropTypes.func,
  onTriggerRequiredEmail: PropTypes.func
}

Roles.defaultProps = {
  disableAddRole: false,
  allowDeleteRole: true,
  isEmailRequired: false,
  filter: () => true,
  onCloseAddRoleDrawer: () => null,
  onTriggerRequiredEmail: () => null
}

export default connect(
  ({ deals }) => ({
    roles: deals.roles
  }),
  {
    notify,
    deleteRole,
    createRoles,
    confirmation
  }
)(Roles)
