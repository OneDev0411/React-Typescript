import React, { Component } from 'react'

import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

export default class Item extends Component {
  state = {
    text: this.props.tag.text,
    loading: false
  }

  resetState = () => this.setState({ text: this.props.tag.text })

  onChange = text => this.setState({ text })

  save = async toggleMode => {
    this.setState({ loading: true })

    const done = await this.props.onChange({
      oldText: this.props.tag.text,
      newText: this.state.text
    })

    this.setState({ loading: false })

    if (done) {
      toggleMode()
    }
  }

  delete = async tag => {
    this.setState({ loading: true })

    await this.props.onDelete(tag)

    this.setState({ loading: false })
  }

  renderEditMode = props => (
    <EditMode
      value={this.state.text}
      onChange={this.onChange}
      loading={this.state.loading}
      {...props}
    />
  )

  renderViewMode = () => (
    <ViewMode
      onDelete={this.delete}
      tag={this.props.tag}
      loading={this.state.loading}
    />
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
