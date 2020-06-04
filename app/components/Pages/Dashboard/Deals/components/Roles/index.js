import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import UserAvatar from 'components/Avatar'
import { createRoles, deleteRole } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import DeleteRole from 'components/DealRole/components/DeleteRole'

import { selectDealRoles } from 'reducers/deals/roles'

import DealRole from 'components/DealRole'

import TeamAgents from 'components/TeamAgents'

import { roleName, getLegalFullName, isPrimaryAgent } from '../../utils/roles'
import { getAvatarTitle } from '../../utils/get-avatar-title'

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

  onSelectRole = role => {
    if (!role.email && this.props.isEmailRequired) {
      this.props.onTriggerRequiredEmail()

      return this.props.confirmation({
        message: `${getLegalFullName(role)} has no email!`,
        description: `Add ${getLegalFullName(role)}'s email to continue.`,
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

  toggleReplaceAgentDrawer = user =>
    this.setState(state => ({
      user: state.user ? null : user,
      isReplaceAgentDrawerOpen: !state.isReplaceAgentDrawerOpen
    }))

  handleReplaceAgent = async agents => {
    const { agent: user } = agents[0]

    this.toggleReplaceAgentDrawer()

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

    try {
      await this.props.deleteRole(this.props.deal.id, this.state.user.id)
      await this.props.createRoles(this.props.deal.id, [role])

      this.props.notify({
        message: 'Primary Agent replaced',
        status: 'success'
      })
    } catch (e) {
      console.log(e)
      this.props.notify({
        message: 'Could not replace the primary agent. please try again.',
        status: 'success'
      })
    }
  }

  get AllowedRoles() {
    return this.props.allowedRoles
  }

  getIsRowRemovable(role) {
    return (
      this.props.allowDeleteRole &&
      !isPrimaryAgent(role, this.props.deal.deal_type)
    )
  }

  render() {
    return (
      <RolesContainer style={this.props.containerStyle}>
        {this.props.showTitle && <RolesTitle>Contacts</RolesTitle>}

        {this.props.roles
          .filter(
            role =>
              role &&
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
                      size={32}
                      color="#000"
                      title={getAvatarTitle(role)}
                      image={role.user ? role.user.profile_image_url : null}
                    />
                  </RoleAvatar>

                  <RoleInfo onClick={() => this.onSelectRole(role)}>
                    <RoleTitle>{getLegalFullName(role)}</RoleTitle>
                    <RoleType>
                      {roleName(role.role)}
                      {this.props.showEmail &&
                        role.user &&
                        ` . ${role.user.email}`}
                    </RoleType>
                  </RoleInfo>
                </Flex>

                {this.props.allowDeleteRole && (
                  <RoleActions>
                    {isRowRemovable ? (
                      <DeleteRole
                        deal={this.props.deal}
                        role={role}
                        style={{ padding: 0, marginLeft: '0.5rem' }}
                      />
                    ) : (
                      <Button
                        color="secondary"
                        variant="outlined"
                        size="small"
                        onClick={() => this.toggleReplaceAgentDrawer(role)}
                      >
                        Replace
                      </Button>
                    )}
                  </RoleActions>
                )}

                {this.state.isRoleFormOpen &&
                  role.id === this.state.user.id && (
                    <DealRole
                      isOpen
                      deal={this.props.deal}
                      form={this.state.user}
                      isRoleRemovable={isRowRemovable}
                      isEmailRequired={this.props.isEmailRequired}
                      showBrokerageFields={this.props.showBrokerageFields}
                      allowedRoles={this.props.allowedRoles}
                      onUpsertRole={this.props.onUpsertRole}
                      onClose={this.closeRoleForm}
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
            showBrokerageFields={this.props.showBrokerageFields}
            allowedRoles={this.AllowedRoles}
            onCreateRole={this.props.onCreateRole}
            onCloseDrawer={this.props.onCloseAddRoleDrawer}
          />
        )}

        {this.state.isReplaceAgentDrawerOpen && (
          <TeamAgents
            isPrimaryAgent
            withRelatedContacts={false}
            user={this.props.user}
            title="Select New Primary Agent"
            onSelectAgents={this.handleReplaceAgent}
            onClose={this.toggleReplaceAgentDrawer}
          />
        )}
      </RolesContainer>
    )
  }
}

Roles.propTypes = propTypes
Roles.defaultProps = defaultProps

function mapStateToProps({ user, deals }, props) {
  return {
    user,
    roles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(
  mapStateToProps,
  {
    notify,
    createRoles,
    deleteRole,
    confirmation
  }
)(Roles)
