import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { confirmation } from 'actions/confirmation'

import Builder from './Builder'

class InstantMarketing extends React.Component {
  handleCloseRequest = () => {
    if (this.props.closeConfirmation === false) {
      return this.props.onClose()
    }

    this.props.confirmation({
      message: 'Don’t want to market?',
      description: 'By canceling you will lose any changes you have made.',
      cancelLabel: 'No, don’t cancel',
      confirmLabel: 'Yes, cancel',
      onConfirm: this.props.onClose
    })
  }

  render() {
    if (!this.props.isOpen) {
      return false
    }

    return (
      <Builder
        onClose={this.handleCloseRequest}
        onSave={this.props.handleSave}
        onSocialSharing={this.props.handleSocialSharing}
        {...this.props}
      />
    )
  }
}

InstantMarketing.propTypes = {
  headerTitle: PropTypes.string,
  closeConfirmation: PropTypes.bool,
  showTemplatesColumn: PropTypes.bool,
  templateData: PropTypes.object,
  templateTypes: PropTypes.array,
  mediums: PropTypes.string,
  assets: PropTypes.array,
  defaultTemplate: PropTypes.any,
  containerStyle: PropTypes.object
}

InstantMarketing.defaultProps = {
  headerTitle: 'Marketing Center',
  closeConfirmation: true,
  showTemplatesColumn: true,
  templateData: {},
  templateTypes: [],
  mediums: '',
  assets: [],
  defaultTemplate: null,
  containerStyle: {}
}

export default connect(
  null,
  { confirmation }
)(InstantMarketing)
