import React, { Component } from 'react'

import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

export default class Item extends Component {
  state = {
    text: this.props.tag.text
  }

  resetState = () => this.setState({ text: this.props.tag.text })

  onChange = text => this.setState({ text })

  save = async toggleMode => {
    const done = await this.props.onChange({
      oldText: this.props.tag.text,
      newText: this.state.text
    })

    if (done) {
      toggleMode()
    }
  }

  delete = tag => {
    this.props.onDelete(tag)
  }

  renderEditMode = props => (
    <EditMode value={this.state.text} onChange={this.onChange} {...props} />
  )

  renderViewMode = () => (
    <ViewMode onDelete={this.delete} tag={this.props.tag} />
  )

  render() {
    return (
      <InlineEditableField
        cancelOnOutsideClick
        handleSave={this.save}
        handleDelete={this.delete}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showEdit={false}
        showDelete={false}
        toggleModeCallback={this.resetState}
        style={{ margin: '0.5rem 0.3rem' }}
      />
    )
  }
}
