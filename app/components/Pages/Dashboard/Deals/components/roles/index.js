import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import UserAvatar from '../../../../../Partials/UserAvatar'
import AddRole from './add-role'
import { deleteRole } from '../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../store_actions/confirmation'
import { roleName, getLegalFullName } from '../../utils/roles'
import RoleCrmIntegration from './crm-integration'

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
    showRoleModal: false
  }

  getAvatarTitle = role => {
    const { user, legal_first_name, legal_last_name, company_title } = role
    const fullName =
      `${legal_first_name} ${legal_last_name}`.trim() || company_title

    return fullName || (user && user.display_name)
  }

  onRequestRemoveRole = (e, user) => {
    e.stopPropagation()

    const { deal, confirmation } = this.props
    const { deal_type } = deal

    if (
      (deal_type === 'Buying' && user.role === 'BuyerAgent') ||
      (deal_type === 'Selling' && user.role === 'SellerAgent')
    ) {
      return confirmation({
        message: 'You cannot delete the primary agent for the deal',
        hideCancelButton: true,
        confirmLabel: 'Okay',
        onConfirm: () => null
      })
    }

    confirmation({
      message: `Remove <b>${user.legal_first_name} ${
        user.legal_last_name
      }</b>?`,
      confirmLabel: 'Yes, remove contact',
      onConfirm: () => this.removeRole(user)
    })
  }

  removeRole = async role => {
    const { deleteRole, notify, deal } = this.props
    const { deletingRoleId } = this.state

    if (deletingRoleId) {
      return false
    }

    this.setState({
      deletingRoleId: role.id
    })

    try {
      await deleteRole(deal.id, role.id)
      notify({
        message: 'The contact removed from this deal.',
        status: 'success'
      })
    } catch (e) {
      notify({
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
    const { confirmation, isEmailRequired, onSelect } = this.props

    if (!role.email && isEmailRequired) {
      return confirmation({
        message: `${role.legal_first_name} has no email!`,
        description: `Add ${role.legal_first_name}'s email to continue.`,
        confirmLabel: 'Add Email',
        onConfirm: () => this.setSelectedRole(role)
      })
    }

    if (typeof onSelect === 'function') {
      return onSelect(role)
    }

    this.setSelectedRole(role)
  }

  setSelectedRole = user => {
    this.setState({
      user,
      showRoleModal: true
    })
  }

  closeRoleModal = () => {
    this.setState({ showRoleModal: false })
  }

  render() {
    const { deal, roles, allowedRoles, allowDeleteRole } = this.props
    const { user, deletingRoleId, showRoleModal } = this.state

    return (
      <RolesContainer style={this.props.containerStyle}>
        {this.props.showTitle !== false && <RolesTitle>CONTACTS</RolesTitle>}

        {(deal.roles || [])
          .filter(
            roleId => !allowedRoles || allowedRoles.includes(roles[roleId].role)
          )
          .map(roleId => {
            const role = roles[roleId]
            const { id, user } = role

            return (
              <RoleItem
                key={id}
                className="item"
                onClick={() => this.onSelectRole(role)}
              >
                <RoleAvatar>
                  <UserAvatar
                    size={32}
                    color="#D4D4D4"
                    showStateIndicator={false}
                    name={this.getAvatarTitle(role)}
                    image={user ? user.profile_image_url : null}
                  />
                </RoleAvatar>

                <RoleInfo>
                  <RoleTitle>{getLegalFullName(role)}</RoleTitle>
                  <RoleType>{roleName(role.role)}</RoleType>
                </RoleInfo>

                {allowDeleteRole && (
                  <RoleActions>
                    {deletingRoleId &&
                      id === deletingRoleId && (
                        <i className="fa fa-spinner fa-spin" />
                      )}

                    {!deletingRoleId && (
                      <i
                        onClick={e => this.onRequestRemoveRole(e, role)}
                        className="fa fa-delete fa-times"
                      />
                    )}
                  </RoleActions>
                )}
              </RoleItem>
            )
          })}

        <RoleCrmIntegration
          deal={deal}
          user={user}
          modalTitle="Update Contact"
          isOpen={showRoleModal}
          allowedRoles={allowedRoles}
          onHide={this.closeRoleModal}
        />

        <AddRole deal={deal} allowedRoles={allowedRoles} />
      </RolesContainer>
    )
  }
}

export default connect(
  ({ deals }) => ({
    roles: deals.roles
  }),
  {
    notify,
    deleteRole,
    confirmation
  }
)(Roles)
