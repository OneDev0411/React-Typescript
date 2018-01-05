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

  onClickRole(item) {
    const { onSelectRole, confirmation } = this.props

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
        legal_prefix: item.legal_prefix,
        legal_first_name: item.legal_first_name,
        legal_last_name: item.legal_last_name,
        email: item.email,
        role: item.role
      })
    }
  }

  getRoleName(role) {
    const name = `${role.legal_prefix || ''} ${role.legal_first_name || ''} ${role.legal_last_name || ''}`.trim()
    return name.length > 0 ? name : role.user.display_name
  }

  onRequestRemoveRole(user) {
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
      message: `Remove <b>${user.user.display_name}</b>?`,
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
    const { deal, allowedRoles, onSelectRole } = this.props
    const { deletingRoleId } = this.state
    const { roles } = deal

    return (
      <div className="deal-info-section deal-roles">
        <div className="deal-info-title">
          CONTACTS
        </div>

        {
          roles &&
          roles
            .filter(item => !allowedRoles ? true : allowedRoles.indexOf(item.role) > -1)
            .map(item =>
              <div
                key={item.id}
                className="item"
                style={{ cursor: onSelectRole ? 'pointer' : 'auto' }}
                onClick={() => this.onClickRole(item)}
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
                  <div>{this.getRoleName(item)}</div>
                  <div className="role">{ roleName(item.role) }</div>
                </div>

                <div className="cta">
                  {
                    deletingRoleId && item.id === deletingRoleId &&
                    <i className="fa fa-spinner fa-spin" />
                  }

                  {
                    !deletingRoleId &&
                    <i
                      onClick={() => this.onRequestRemoveRole(item)}
                      className="fa fa-delete fa-times"
                    />
                  }
                </div>
              </div>
            )
        }

        <UpsertRole
          deal={deal}
          allowedRoles={allowedRoles}
        />
      </div>
    )
  }
}

export default connect(null, { deleteRole,selectRole, notify, confirmation })(Roles)
