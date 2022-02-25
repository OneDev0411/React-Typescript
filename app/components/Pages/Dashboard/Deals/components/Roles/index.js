import React from 'react'

import { Box, Button } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { confirmation } from 'actions/confirmation'
import { createRoles, deleteRole } from 'actions/deals'
import { Avatar } from 'components/Avatar'
import DealRole from 'components/DealRole'
import DeleteRole from 'components/DealRole/components/DeleteRole'
import { addNotification as notify } from 'components/notification'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TeamAgentsDrawer } from 'components/TeamAgentsDrawer'
import { getContactNameInitials } from 'models/contacts/helpers'
import { selectDealRoles } from 'reducers/deals/roles'
import { getNameInitials } from 'utils/helpers'

import { SectionTitle } from '../../Dashboard/Factsheet/styled'
import { getAvatarTitle } from '../../utils/get-avatar-title'
import { getLegalFullName, isPrimaryAgent } from '../../utils/roles'

import AddRole from './AddRole'
import { RoleName } from './RoleName'
import {
  RolesContainer,
  RoleItem,
  RoleAvatar,
  RoleInfo,
  RoleTitle,
  RoleType,
  RoleActions
} from './styled'

const propTypes = {
  deal: PropTypes.object.isRequired,
  disableAddRole: PropTypes.bool,
  disableList: PropTypes.bool,
  allowDeleteRole: PropTypes.bool,
  showEmail: PropTypes.bool,
  showTitle: PropTypes.bool,
  isEmailRequired: PropTypes.bool,
  allowEditRole: PropTypes.bool,
  filter: PropTypes.func,
  containerStyle: PropTypes.object,
  addRoleActionRenderer: PropTypes.func,
  onCloseAddRoleDrawer: PropTypes.func,
  onTriggerRequiredEmail: PropTypes.func,
  onSelect: PropTypes.func,
  onUpsertRole: PropTypes.func,
  onCreateRole: PropTypes.func
}

const defaultProps = {
  showEmail: false,
  disableAddRole: false,
  disableList: false,
  allowDeleteRole: true,
  isEmailRequired: false,
  allowEditRole: false,
  showTitle: true,
  filter: () => true,
  containerStyle: {},
  onCloseAddRoleDrawer: () => null,
  onTriggerRequiredEmail: () => null
}

class Roles extends React.Component {
  state = {
    user: null,
    form: null,
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

  closeRoleForm = () =>
    this.setState({
      isRoleFormOpen: false,
      isReplaceAgentDrawerOpen: false,
      user: null
    })

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

    const { office, work_phone } = user.agents?.[0] || {}
    const currentRole = this.state.user

    let role = {
      user: user.id,
      agents: user.agents,
      brand: user.brand_id,
      email: user.email,
      role: currentRole.role,
      legal_last_name: user.last_name,
      legal_first_name: user.first_name,
      phone_number: user.phone_number || work_phone,
      company: office ? office.name : '',
      commission_dollar: currentRole.commission_dollar,
      commission_percentage: currentRole.commission_percentage
    }

    if (Array.isArray(user.agents) && user.agents.length > 1) {
      this.setState({
        isRoleFormOpen: true,
        form: role
      })

      return
    }

    role = {
      ...role,
      agent: user.agents?.[0].id
    }

    this.toggleReplaceAgentDrawer()

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
    const roles = this.props.roles.filter(
      role =>
        role &&
        this.props.filter(role) &&
        (!this.props.allowedRoles ||
          this.props.allowedRoles.includes(role.role))
    )

    return (
      <RolesContainer style={this.props.containerStyle}>
        {this.props.showTitle && (
          <Box mb={1.5}>
            <SectionTitle variant="body1">Contacts</SectionTitle>
          </Box>
        )}

        {this.props.disableList === false && (
          <>
            {roles.map(role => {
              const isRowRemovable = this.getIsRowRemovable(role.role)

              return (
                <RoleItem
                  key={role.id}
                  allowDeleteRole={this.props.allowDeleteRole}
                  className="item"
                >
                  <Flex alignCenter justifyBetween style={{ flexGrow: 1 }}>
                    <Flex alignCenter>
                      <RoleAvatar>
                        <Avatar
                          alt={getAvatarTitle(role)}
                          user={role.user}
                          size="small"
                        >
                          {role.user
                            ? getContactNameInitials(role.user)
                            : getNameInitials(getLegalFullName(role), 1)}
                        </Avatar>
                      </RoleAvatar>

                      <RoleInfo onClick={() => this.onSelectRole(role)}>
                        <RoleTitle>{getLegalFullName(role)}</RoleTitle>

                        {this.props.allowEditRole && (
                          <SvgIcon
                            path={mdiPencilOutline}
                            size={muiIconSizes.small}
                          />
                        )}
                      </RoleInfo>
                    </Flex>

                    <RoleType>
                      <RoleName name={role.role} />
                      {this.props.showEmail &&
                        role.user &&
                        ` . ${role.user.email}`}
                    </RoleType>
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
                          size="small"
                          style={{
                            padding: 0,
                            margin: 0
                          }}
                          onClick={() => this.toggleReplaceAgentDrawer(role)}
                        >
                          Replace
                        </Button>
                      )}
                    </RoleActions>
                  )}

                  {this.state.isRoleFormOpen &&
                    !this.state.isReplaceAgentDrawerOpen &&
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
          </>
        )}

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

        {this.state.isReplaceAgentDrawerOpen && !this.state.isRoleFormOpen && (
          <TeamAgentsDrawer
            open
            isPrimaryAgent
            withRelatedContacts={false}
            title="Select New Primary Agent"
            onSelectAgents={this.handleReplaceAgent}
            onClose={this.toggleReplaceAgentDrawer}
          />
        )}

        {this.state.isRoleFormOpen && this.state.isReplaceAgentDrawerOpen && (
          <DealRole
            isOpen
            title="Replace Agent"
            deal={this.props.deal}
            form={this.state.form}
            isRoleRemovable={false}
            isEmailRequired
            showBrokerageFields={false}
            allowedRoles={[]}
            onBeforeUpsert={async () =>
              this.props.deleteRole(this.props.deal.id, this.state.user.id)
            }
            onUpsertRole={this.props.onUpsertRole}
            onClose={this.closeRoleForm}
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

export default connect(mapStateToProps, {
  notify,
  createRoles,
  deleteRole,
  confirmation
})(Roles)
