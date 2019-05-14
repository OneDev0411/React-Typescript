import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Flex from 'styled-flex-component'

import UserAvatar from 'components/Avatar'
import { createRoles } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import ActionButton from 'components/Button/ActionButton'
import DeleteRole from 'components/DealRole/components/DeleteRole'

import { selectDealRoles } from 'reducers/deals/roles'

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

const propTypes = {
  disableAddRole: PropTypes.bool,
  allowDeleteRole: PropTypes.bool,
  showEmail: PropTypes.bool,
  showTitle: PropTypes.bool,
  isEmailRequired: PropTypes.bool,
  filter: PropTypes.func,
  addRoleActionRenderer: PropTypes.func,
  onCloseAddRoleDrawer: PropTypes.func,
  onTriggerRequiredEmail: PropTypes.func
}

const defaultProps = {
  showEmail: false,
  disableAddRole: false,
  allowDeleteRole: true,
  isEmailRequired: false,
  showTitle: true,
  filter: () => true,
  onCloseAddRoleDrawer: () => null,
  onTriggerRequiredEmail: () => null
}

class Roles extends React.Component {
  state = {
    user: null,
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

  getIsRowRemovable(role) {
    return this.props.allowDeleteRole && !this.isPrimaryAgent(role)
  }

  render() {
    return (
      <RolesContainer style={this.props.containerStyle}>
        {this.props.showTitle && <RolesTitle>Contacts</RolesTitle>}

        {this.props.roles
          .filter(
            role =>
              this.props.filter(role) &&
              (!this.props.allowedRoles ||
                this.props.allowedRoles.includes(role.role))
          )
          .map(role => {
            const isRowRemovable = this.getIsRowRemovable(role.role)

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
                      {this.props.showEmail && role.user
                        ? ` . ${role.user.email}`
                        : null}
                    </RoleType>
                  </RoleInfo>
                </Flex>

                <RoleActions>
                  {isRowRemovable ? (
                    <DeleteRole
                      deal={this.props.deal}
                      role={role}
                      style={{ padding: 0, marginLeft: '0.5rem' }}
                    />
                  ) : (
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

                {this.state.isRoleFormOpen && role.id === this.state.user.id && (
                  <RoleCrmIntegration
                    isOpen
                    formOptions={{
                      position: {
                        top: '3rem',
                        left: '1.5rem'
                      }
                    }}
                    deal={this.props.deal}
                    role={this.state.user}
                    modalTitle="Update Contact"
                    isRoleRemovable={isRowRemovable}
                    isEmailRequired={this.props.isEmailRequired}
                    allowedRoles={this.props.allowedRoles}
                    onUpsertRole={this.props.onUpsertRole}
                    onHide={this.closeRoleForm}
                  />
                )}
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

Roles.propTypes = propTypes
Roles.defaultProps = defaultProps

function mapStateToProps({ deals }, props) {
  return {
    roles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(
  mapStateToProps,
  {
    notify,
    createRoles,
    confirmation
  }
)(Roles)
