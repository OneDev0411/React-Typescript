import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import UserAvatar from '../../../../../Partials/UserAvatar'
import UpsertRole from './upsert-role'
import { deleteRole, selectRole } from '../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../store_actions/confirmation'
import roleName from '../../utils/roles'

class Roles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deletingRoleId: null
    }
  }

  selectRole(role) {
    this.props.selectRole(role)
  }

  onClickRole(id) {
    const { roles, onSelectRole, confirmation } = this.props
    const item = roles[id]

    if (onSelectRole) {
      if (!item.email) {
        return confirmation({
          message: `${item.legal_first_name} has no email!`,
          description: `Add ${item.legal_first_name}'s email to continue.`,
          confirmLabel: 'Add Email',
          onConfirm: () => this.selectRole(item)
        })
      }

      onSelectRole({
        id: item.id,
        legal_prefix: item.legal_prefix,
        legal_first_name: item.legal_first_name,
        legal_last_name: item.legal_last_name,
        email: item.email,
        role: item.role
      })
    } else {
      this.selectRole(item)
    }
  }

  getRoleName(role) {
    const name = `${role.legal_prefix || ''} ${role.legal_first_name || ''} ${role.legal_last_name || ''}`.trim()
    return name.length > 0 ? name : role.user.display_name
  }

  onRequestRemoveRole(e, user) {
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

  async removeRole(role) {
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
        message: 'Role removed',
        status: 'success'
      })
    } catch (e) {
      notify({
        message: 'Can not remove role, try again',
        status: 'error'
      })
    } finally {
      this.setState({
        deletingRoleId: null
      })
    }
  }

  render() {
    const { deal, allowedRoles, roles, onSelectRole, allowDeleteRole } = this.props
    const { deletingRoleId } = this.state

    return (
      <div className="deal-info-section deal-roles">
        <div className="deal-info-title">
          CONTACTS
        </div>

        {
          deal.roles &&
          deal.roles
            .filter(id => !allowedRoles ? true : allowedRoles.indexOf(roles[id].role) > -1)
            .map(id => {
              const item = roles[id]
              return (
                <div
                  key={item.id}
                  className="item"
                  onClick={() => this.onClickRole(item.id)}
                >
                  <div className="role-avatar">
                    <UserAvatar
                      name={this.getRoleName(item)}
                      image={item.user ? item.user.profile_image_url : null}
                      size={32}
                      showStateIndicator={false}
                    />
                  </div>

                  <div className="name">
                    <div className="title">{this.getRoleName(item)}</div>
                    <div className="role">{ roleName(item.role) }</div>
                  </div>

                  {
                    allowDeleteRole  &&
                    <div className="cta">
                      {
                        deletingRoleId && item.id === deletingRoleId &&
                        <i className="fa fa-spinner fa-spin" />
                      }

                      {
                        !deletingRoleId &&
                        <i
                          onClick={(e) => this.onRequestRemoveRole(e, item)}
                          className="fa fa-delete fa-times"
                        />
                      }
                    </div>
                  }
                </div>
              )
            })
        }

        <UpsertRole
          deal={deal}
          allowedRoles={allowedRoles}
        />
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  roles: deals.roles
}), { deleteRole,selectRole, notify, confirmation })(Roles)
