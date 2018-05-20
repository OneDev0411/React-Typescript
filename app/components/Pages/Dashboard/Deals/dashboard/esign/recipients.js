import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import AddSigner from './add-signer'
import RecipientGroup from './recipient-group'

class AddRecipients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showRolesModal: false,
      selectedOrder: null
    }
  }

  hideRolesModal() {
    this.setState({ showRolesModal: false })
  }

  showRolesModal(selectedOrder) {
    this.setState({ showRolesModal: true, selectedOrder })
  }

  onAddRecipient(role) {
    const { recipients, onAddRecipient } = this.props

    // hide modal
    this.hideRolesModal()

    const isExists = _.find(recipients, rcp => rcp.role === role.id)

    if (!isExists) {
      onAddRecipient(role, this.state.selectedOrder)
    }
  }

  render() {
    const { deal, recipients, onRemoveRecipient, allowedRoles } = this.props

    const groups = _.groupBy(recipients, 'order')
    const next = _.max(recipients, 'order').order + 2 || 1

    return (
      <div style={{ width: '100%' }}>
        <div className="rcp-container">
          {Array.apply(null, { length: next }).map((empty, order) => (
            <RecipientGroup
              key={order}
              group={groups[order]}
              order={order + 1}
              onAddRecipient={() => this.showRolesModal(order)}
              onRemoveRecipient={onRemoveRecipient}
            />
          ))}

          <AddSigner
            show={this.state.showRolesModal}
            deal={deal}
            allowedRoles={allowedRoles}
            onAddRecipient={role => this.onAddRecipient(role)}
            onHide={() => this.hideRolesModal()}
          />
        </div>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  roles: deals.roles
}))(AddRecipients)
