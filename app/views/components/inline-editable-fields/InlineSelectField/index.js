import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'

import { InlineEditableField } from '../InlineEditableField'
import { EditMode } from './EditMode'

const ITEM_TYPE = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired
})

const DEFAULT_ITEM = {
  label: 'Select',
  value: ''
}

export class InlineSelectField extends React.Component {
  static propTypes = {
    defaultSelectedItem: ITEM_TYPE,
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
    handleAddNew: PropTypes.func,
    items: PropTypes.arrayOf(ITEM_TYPE).isRequired,
    label: PropTypes.string.isRequired,
    showAdd: PropTypes.bool,
    showEdit: PropTypes.bool,
    showDelete: PropTypes.bool
  }

  static defaultProps = {
    defaultSelectedItem: DEFAULT_ITEM,
    handleDelete: noop,
    handleAddNew: noop,
    showAdd: false,
    showDelete: true,
    showEdit: true
  }

  state = {
    disabled: false,
    selectedItem: this.props.defaultSelectedItem
  }

  get value() {
    return this.state.selectedItem.value || '-'
  }

  onChange = selectedItem => {
    this.setState({ selectedItem })
  }

  save = async toggleMode => {
    try {
      this.setState({ disabled: true })
      await this.props.handleSave(this.state.selectedItem.value)
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
      this.setState({ disabled: false, selectedItem: DEFAULT_ITEM }, toggleMode)
    } catch (error) {
      console.log(error)
      this.setState({ disabled: false })
    }
  }

  renderEditMode = props => (
    <EditMode
      {...props}
      items={this.props.items}
      label={this.props.label}
      onChange={this.onChange}
      selectedItem={this.state.selectedItem}
    />
  )

  render() {
    return (
      <InlineEditableField
        isDisabled={this.state.disabled}
        label={this.props.label}
        handleSave={this.save}
        handleDelete={this.delete}
        showDelete={this.props.showDelete}
        renderEditMode={this.renderEditMode}
        value={this.value}
      />
    )
  }
}
