import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FinalFormDrawer } from '../../../../../../../views/components/FinalFormDrawer'

const propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

class EditForm extends React.Component {
  state = {
    submitting: false
  }
  onSubmit = values => {
    console.log(values)
  }

  render() {
    return (
      <FinalFormDrawer
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        submitting={this.state.submitting}
        title="Edit Addresses"
      >
        Salam
      </FinalFormDrawer>
    )
  }
}

EditForm.propTypes = propTypes

export default connect()(EditForm)
