import React, { Component } from 'react'

import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

export default class Item extends Component {
  state = {
    isEditing: false,
    loading: false,
    text: this.props.tag.text
  }

  toggleEditing = () =>
    this.setState(state => ({
      isEditing: !state.isEditing
    }))

  onChange = text => this.setState({ text })

  cancel = () =>
    this.setState({
      isEditing: false,
      text: this.props.tag.text
    })

  save = async () => {
    if (this.state.loading) {
      return
    }

    if (this.state.text === this.props.tag.text) {
      return this.setState({ isEditing: false })
    }

    try {
      this.setState({ loading: true })

      const done = await this.props.onChange({
        oldText: this.props.tag.text,
        newText: this.state.text
      })

      this.setState({ loading: false })

      if (done) {
        this.setState({ loading: false, isEditing: false })
      }
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
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
        handleCancel={this.cancel}
        handleSave={this.save}
        handleDelete={this.delete}
        isDisabled={this.state.loading}
        isEditing={this.state.isEditing}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showEdit={false}
        showDelete={false}
        style={{ margin: '0.5rem 0.3rem' }}
        toggleMode={this.toggleEditing}
      />
    )
  }
}
