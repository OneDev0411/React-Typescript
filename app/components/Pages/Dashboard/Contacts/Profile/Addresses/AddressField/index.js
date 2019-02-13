import React from 'react'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

export class AddressField extends React.Component {
  state = {
    isEditMode: false
  }

  toggleMode = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.setState(state => ({ isEditMode: !state.isEditMode }))
  }

  render() {
    const _props = {
      address: this.props.address,
      toggleMode: this.toggleMode
    }

    if (this.state.isEditMode) {
      return (
        <EditMode
          {..._props}
          handleSubmit={this.props.handleSubmit}
          handleDelete={this.props.handleDelete}
        />
      )
    }

    return <ViewMode {..._props} handleAddNew={this.props.handleAddNew} />
  }
}
