import React from 'react'
import { connect } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'
import DealRole from 'components/DealRole'
import ActionButton from 'components/Button/ActionButton'

import { normalizeRoleNames } from '../../../utils/get-roles-text'
import { getLegalFullName, roleName } from '../../../../utils/roles'

export class RolesEdit extends React.Component {
  state = {
    selectedRole: this.DefaultSelectedRole
  }

  handleSelectRole = role =>
    this.setState({
      selectedRole: role.id
    })

  get AllowedRoles() {
    const roles = this.props.selectedAnnotation.data.roleName

    return normalizeRoleNames(this.props.deal, roles)
  }

  get DefaultSelectedRole() {
    const { props } = this

    if (props.roles.length === 0) {
      return null
    }

    if (props.annotationContext && props.annotationContext.number >= 0) {
      return this.props.roles[props.annotationContext.number].id
    }

    return this.props.roles[0].id
  }

  render() {
    // console.log('?????', this.props)

    const role = this.props.roles[0]

    return (
      <DealRole
        form={role}
        deal={this.props.deal}
        // dealSide={this.props.dealSide}
        // isSubmitting={this.state.isSaving}
        // isEmailRequired={this.props.isEmailRequired}
        // formTitle={this.props.modalTitle}
        // formOptions={this.props.formOptions}
        // isCommissionRequired={this.props.isCommissionRequired}
        // allowedRoles={this.AllowedRoles}
        isOpen={this.props.isOpen}
        // onFormSubmit={this.onSubmit}
        // onClose={this.props.onHide}
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
