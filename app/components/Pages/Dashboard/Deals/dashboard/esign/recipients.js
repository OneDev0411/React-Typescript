import React from 'react'
import { connect } from 'react-redux'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'underscore'
import AddSigner from './add-signer'
import roleName from '../../utils/roles'

class AddRecipients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showRolesModal: false
    }
  }

  toggleRolesModal(e) {
    const c = e ? e.target.className : null

    if (c && c.includes('recp')) {
      return false
    }

    this.setState({ showRolesModal: !this.state.showRolesModal })
  }

  onAddRecipient(role) {
    const { onAddRecipient } = this.props

    this.toggleRolesModal()
    onAddRecipient(role)
  }

  render() {
    const {
      deal,
      roles,
      recipients,
      onRemoveRecipient,
      allowedRoles
    } = this.props

    return (
      <div style={{ width: '100%' }}>
        <div
          className="rcp-container"
          onClick={(e) => this.toggleRolesModal(e)}
        >

          {
            _.map(recipients, recp => {
              const role = roles[recp.role]
              return (
                <span className="recp" key={`RECP_${role.email}`}>
                  <span className="recp-t">
                    {role.legal_prefix} {role.legal_first_name} {role.legal_last_name}
                  </span>
                  <span className="recp-d">{roleName(role.role)}, {role.email}</span>
                  <span className="recp-c">
                    <i
                      className="recp-i fa fa-times"
                      onClick={() => onRemoveRecipient(role.email)}
                    />
                  </span>
                </span>
              )
            })
          }

          {
            _.size(recipients) === 0 &&
            <span className="item-title">
              Each message will be sent separately. Recipients will not see each other.
            </span>
          }
        </div>

        <AddSigner
          show={this.state.showRolesModal}
          deal={deal}
          allowedRoles={allowedRoles}
          onAddRecipient={role => this.onAddRecipient(role)}
          onHide={(e) => this.toggleRolesModal(e)}
        />
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  roles: deals.roles
}))(AddRecipients)
