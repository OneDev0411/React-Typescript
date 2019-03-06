import React from 'react'
import PropTypes from 'prop-types'
import ClickOutside from 'react-click-outside'

import { noop } from 'utils/helpers'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

export class InlineEditableField extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    cancelOnOutsideClick: PropTypes.bool,
    handleCancel: PropTypes.any,
    handleDelete: PropTypes.func,
    handleSave: PropTypes.func.isRequired,
    handleAddNew: PropTypes.func,
    isDisabled: PropTypes.bool,
    isEditing: PropTypes.bool.isRequired,
    isEditModeStatic: PropTypes.bool,
    label: PropTypes.string,
    renderViewMode: PropTypes.func,
    renderEditMode: PropTypes.func.isRequired,
    showAdd: PropTypes.bool,
    showEdit: PropTypes.bool,
    showDelete: PropTypes.bool,
    style: PropTypes.shape(),
    toggleMode: PropTypes.func.isRequired,
    value: PropTypes.string
  }

  static defaultProps = {
    error: '',
    cancelOnOutsideClick: false,
    handleCancel: null,
    handleDelete: noop,
    handleAddNew: noop,
    isDisabled: false,
    isEditModeStatic: false,
    label: 'Label',
    renderViewMode: noop,
    showAdd: false,
    showDelete: true,
    showEdit: true,
    style: {},
    value: ''
  }

  toggleMode = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.props.toggleMode()
  }

  handleAddNew = event => {
    event.stopPropagation()

    this.props.handleAddNew()
  }

  handleCancel = () => {
    if (typeof this.props.handleCancel === 'function') {
      this.props.handleCancel()
    } else {
      this.props.toggleMode()
    }
  }

  get editModeProps() {
    const {
      error,
      handleDelete,
      handleSave,
      isDisabled,
      isEditModeStatic,
      showDelete,
      style,
      renderEditMode: render
    } = this.props

    return {
      error,
      handleCancel: this.handleCancel,
      handleDelete,
      handleSave,
      isDisabled,
      isStatic: isEditModeStatic,
      showDelete,
      style,
      render
    }
  }

  get viewModeProps() {
    const {
      label,
      showAdd,
      showEdit,
      style,
      renderViewMode: renderBody,
      value
    } = this.props

    return {
      label,
      handleAddNew: this.handleAddNew,
      renderBody,
      showAdd,
      showEdit,
      style,
      toggleMode: this.toggleMode,
      value
    }
  }

  render() {
    if (this.props.isEditing) {
      return this.props.cancelOnOutsideClick ? (
        <ClickOutside onClickOutside={this.handleCancel}>
          <EditMode {...this.editModeProps} />
        </ClickOutside>
      ) : (
        <EditMode {...this.editModeProps} />
      )
    }

    return <ViewMode {...this.viewModeProps} />
  }
}
