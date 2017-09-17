import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'underscore'
import AddSigner from './add-signer'

export default class AddRecipients extends React.Component {
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
      recipients,
      onRemoveRecipient
    } = this.props

    return (
      <div
        className="rcp-container"
        onClick={(e) => this.toggleRolesModal(e)}
      >
        <AddSigner
          show={this.state.showRolesModal}
          deal={deal}
          onAddRecipient={role => this.onAddRecipient(role)}
          onHide={(e) => this.toggleRolesModal(e)}
        />

        {
          _.map(recipients, recp =>
            <span className="recp" key={`RECP_${recp.email}`}>
              <span className="recp-t">{recp.first_name} {recp.last_name}</span>
              <span className="recp-d">{recp.role}, {recp.email}</span>
              <span className="recp-c">
                <i
                  className="recp-i fa fa-times"
                  onClick={() => onRemoveRecipient(recp.email)}
                />
              </span>
            </span>
          )
        }

        {
          _.size(recipients) === 0 &&
          <span className="item-title">
            Each message will be sent separately. Recipients will not see each other.
          </span>
        }
      </div>
    )
  }
}
