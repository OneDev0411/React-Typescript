import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'

import { InlineEditableField } from '../InlineEditableField'
import { EditMode } from './EditMode'

export class InlineTextField extends React.Component {
  static propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
    handleAddNew: PropTypes.func,
    label: PropTypes.string.isRequired,
    showAdd: PropTypes.bool,
    showEdit: PropTypes.bool,
    showDelete: PropTypes.bool,
    value: PropTypes.string
  }

  static defaultProps = {
    handleDelete: noop,
    handleAddNew: noop,
    showAdd: false,
    showDelete: true,
    showEdit: true,
    value: ''
  }

  state = {
    disabled: false,
    input: this.props.value
  }

  onChange = event => {
    this.setState({ input: event.target.value })
  }

  save = async toggleMode => {
    try {
      this.setState({ disabled: true })
      await this.props.handleSave(this.state.input)
      this.setState({ disabled: false }, toggleMode)
    } catch (error) {
      console.log(error)
      this.setState({ disabled: false })
    }
  }

  delete = async toggleMode => {
    try {
      this.setState({ disabled: true })
      await this.props.handleDelete()
      this.setState({ disabled: false, input: '' }, toggleMode)
    } catch (error) {
      console.log(error)
      this.setState({ disabled: false })
    }
  }

  renderEditMode = props => (
    <EditMode
      {...props}
      onChange={this.onChange}
      value={this.state.input}
      label={this.props.label}
    />
  )

  render() {
    return (
      <InlineEditableField
        isDisabled={this.state.disabled}
        label={this.props.label}
        value={this.state.input}
        handleSave={this.save}
        handleDelete={this.delete}
        showDelete={this.props.showDelete}
        renderEditMode={this.renderEditMode}
      />
    )
  }
}
