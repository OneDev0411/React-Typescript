import React, { Component } from 'react'

import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import ViewMode from './ViewMode'
import EditMode from './EditMode'

export default class Item extends Component {
  state = {
    text: this.props.tag.text
  }

  resetState = () => this.setState({ text: this.props.tag.text })

  onChange = text => this.setState({ text })

  handleSave = () => {
    this.props.onChange({
      oldText: this.props.tag.text,
      newText: this.state.text
    })
  }

  handleDelete = tag => {
    this.props.onDelete(tag)
  }

  renderEditMode = props => (
    <EditMode value={this.state.text} onChange={this.onChange} {...props} />
  )

  renderViewMode = () => (
    <ViewMode onDelete={this.handleDelete} tag={this.props.tag} />
  )

  render() {
    return (
      <InlineEditableField
        handleSave={this.handleSave}
        handleDelete={this.handleDelete}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showEdit={false}
        showDelete={false}
        cancleOnOutsideClick
        toggleModeCallback={this.resetState}
      />
    )
  }
}
