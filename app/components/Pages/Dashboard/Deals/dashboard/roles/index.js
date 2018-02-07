import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import UserAvatar from '../../../../../Partials/UserAvatar'
import UpsertRole from './upsert-role'
import { deleteRole } from '../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../store_actions/confirmation'
import { roleName } from '../../utils/roles'
import AddRoleModal from './AddRoleModal'

class Roles extends React.Component {
  state = {
    deletingRoleId: null,
    showAddRoleModal: false
  }

  setSellectedRole = role => {
    this.setState({
      form: role,
      showAddRoleModal: true
    })
  }

  getRoleName = role => {
    const name = `${role.legal_prefix || ''} ${role.legal_first_name ||
      ''} ${role.legal_last_name || ''}`.trim()

    return role.user ? role.user.display_name : name
  }

  handleOnClick = role => {
    const { confirmation, isRequiredEmail, onSelect } = this.props

    if (!role.email && isRequiredEmail) {
      return confirmation({
        message: `${role.legal_first_name} has no email!`,
        description: `Add ${role.legal_first_name}'s email to continue.`,
        confirmLabel: 'Add Email',
        onConfirm: () => this.setSellectedRole(role)
      })
    }

    if (typeof onSelect === 'function') {
      onSelect(role)

      return
    }

    this.setSellectedRole(role)
  }

  onRequestRemoveRole = (e, user) => {
    const { deal, confirmation } = this.props
    const { deal_type } = deal

    // stop propagating
    e.stopPropagation()

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
      message: `Remove <b>${user.legal_first_name} ${user.legal_last_name}</b>?`,
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

  closeAddRoleModal = () => {
    this.setState({ showAddRoleModal: false })
  }

  render() {
    const {
      deal,
      allowedRoles,
      roles,
      allowDeleteRole,
      isRequiredEmail
    } = this.props
    const { deletingRoleId, form, showAddRoleModal } = this.state

    return (
      <div className="deal-info-section deal-roles">
        <div className="deal-info-title">CONTACTS</div>

        {deal.roles &&
          deal.roles
            .filter(roleId => !allowedRoles || allowedRoles.includes(roles[roleId].role))
            .map(roleId => {
              const role = roles[roleId]
              const { id, user } = role

              return (
                <div
                  key={id}
                  className="item"
                  onClick={() => this.handleOnClick(role)}
                >
                  <div className="role-avatar">
                    <UserAvatar
                      size={32}
                      showStateIndicator={false}
                      name={this.getRoleName(role)}
                      image={user ? user.profile_image_url : null}
                    />
                  </div>

                  <div className="name">
                    <div className="title">{this.getRoleName(role)}</div>
                    <div className="role">{roleName(role.role)}</div>
                  </div>

                  {allowDeleteRole && (
                    <div className="cta">
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
                    </div>
                  )}
                </div>
              )
            })}

        <AddRoleModal
          deal={deal}
          role={form}
          isOpen={showAddRoleModal}
          allowedRoles={allowedRoles}
          isRequiredEmail={isRequiredEmail}
          closeHandler={this.closeAddRoleModal}
        />

        <UpsertRole deal={deal} allowedRoles={allowedRoles} />
      </div>
    )
  }
}

function mapToProps({ deals }) {
  const { roles } = deals

  return { roles }
}

export default connect(mapToProps, {
  notify,
  deleteRole,
  confirmation
})(Roles)
