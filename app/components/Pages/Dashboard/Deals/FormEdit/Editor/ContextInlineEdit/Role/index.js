import React from 'react'
import { connect } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'
import ActionButton from 'components/Button/ActionButton'

import RoleCrmIntegration from '../../../../components/Roles/CrmIntegration'

import { normalizeRoleNames } from '../../../utils/get-roles-text'
import { getLegalFullName, roleName } from '../../../../utils/roles'

class RolesEdit extends React.Component {
  getAllowedRoles = () =>
    normalizeRoleNames(this.props.deal, this.props.roleName)

  render() {
    const allowedRoles = this.getAllowedRoles()
    const roles = this.props.roles.filter(user =>
      allowedRoles.includes(user.role)
    )

    return (
      <RoleCrmIntegration
        isOpen
        deal={this.props.deal}
        role={roles[this.props.roleIndex]}
        // isRoleRemovable={isRowRemovable}
        allowedRoles={allowedRoles}
        // onUpsertRole={this.props.onUpsertRole}
        // onHide={this.closeRoleForm}
      />
    )

    return (
      <div>
        <div
          style={{
            padding: '0.5rem'
          }}
        >
          {this.props.roles.map(role => (
            <div
              key={role.id}
              onClick={() => this.handleSelectRole(role)}
              style={{
                display: 'inline-block',
                padding: '5px',
                margin: '0.25rem',
                border: '1px solid #ccc',
                borderRadius: '3px',
                fontWeight:
                  this.state.selectedRole === role.id ? 'bold' : 'normal'
              }}
            >
              <div style={{ fontSize: '14px' }}>{getLegalFullName(role)}</div>
              <div style={{ fontSize: '12px' }}>{roleName(role.role)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', padding: '0.5rem' }}>
          <div>
            <input type="text" placeholder="Legal First Name" />
          </div>

          <div>
            <input type="text" placeholder="Legal Middle Name" />
          </div>

          <div>
            <input type="text" placeholder="Legal Last Name" />
          </div>

          <div>
            <input type="text" placeholder="Email" />
          </div>

          <div>
            <input type="text" placeholder="Phone" />
          </div>
        </div>

        <div
          style={{
            background: '#eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0.5rem 10px',
            marginTop: '0.5rem'
          }}
        >
          <ActionButton size="small">Save</ActionButton>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    roles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(mapStateToProps)(RolesEdit)
