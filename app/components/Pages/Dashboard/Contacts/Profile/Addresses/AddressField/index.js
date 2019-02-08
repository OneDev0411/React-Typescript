import React from 'react'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

export class AddressField extends React.Component {
  state = {
    isEditMode: false
  }

  toggleMode = event => {
    event.stopPropagation()
    this.setState(state => ({ isEditMode: !state.isEditMode }))
  }

  render() {
    const { field } = this.props

    console.log('state', this.state)

    const _props = {
      field,
      toggleMode: this.toggleMode
    }

    if (this.state.isEditMode) {
      return <EditMode {..._props} />
    }

    return <ViewMode {..._props} handleAddNew={this.props.handleAddNew} />
  }
}
