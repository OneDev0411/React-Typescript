import React from 'react'
import { connect } from 'react-redux'

import Builder from './Builder'
import { confirmation } from 'actions/confirmation'

class InstantMarketing extends React.Component {
  handleCloseRequest = () =>
    this.props.confirmation({
      message: 'Don’t want to market?',
      description: 'By canceling you will lose any changes you have made.',
      cancelLabel: 'No, don’t cancel',
      confirmLabel: 'Yes, cancel',
      onConfirm: this.props.onClose
    })

  render() {
    if (!this.props.isOpen) {
      return false
    }

    return (
      <Builder
        templateData={this.props.templateData}
        templateTypes={this.props.templateTypes}
        assets={this.props.assets}
        onSave={this.props.handleSave}
        onClose={this.handleCloseRequest}
      />
    )
  }
}

export default connect(
  null,
  { confirmation }
)(InstantMarketing)
