import React from 'react'
import ClickOutside from 'react-click-outside'

import { noop } from 'utils/helpers'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

interface Props {
  error?: string
  cancelOnOutsideClick?: boolean
  handleCancel?: any
  handleOutsideClick?: any
  handleDelete?: () => void
  handleSave: () => void
  handleAddNew?: () => void
  isDisabled?: boolean
  isEditing: boolean
  isEditModeStatic?: boolean
  label?: string
  renderViewMode?: () => void
  renderEditMode: (params: any) => void
  showAdd?: boolean
  showEdit?: boolean
  showDelete?: boolean
  style?: object
  toggleMode: () => void
  value?: string
}

export const InlineEditableField = (props: Props) => {
  const {
    error = '',
    cancelOnOutsideClick = false,
    handleCancel = null,
    handleOutsideClick = null,
    handleDelete = noop,
    handleAddNew = noop,
    isDisabled = false,
    isEditModeStatic = false,
    label = 'Label',
    renderViewMode = noop,
    showAdd = false,
    showDelete = true,
    showEdit = true,
    style = {},
    value = '',
    toggleMode,
    handleSave,
    isEditing,
    renderEditMode
  } = props

  const _toggleMode = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    toggleMode()
  }

  const _handleAddNew = event => {
    event.stopPropagation()

    handleAddNew()
  }

  const _handleDelete = event => {
    event.stopPropagation()

    handleDelete()
  }

  const _handleCancel = () => {
    if (typeof handleCancel === 'function') {
      handleCancel()
    } else {
      toggleMode()
    }
  }

  const _handleOutsideClick = () => {
    if (typeof handleOutsideClick === 'function') {
      handleOutsideClick()
    } else if (typeof handleCancel === 'function') {
      handleCancel()
    } else {
      toggleMode()
    }
  }

  const editModeProps = () => {
    return {
      error,
      handleCancel: _handleCancel,
      handleDelete,
      handleSave,
      isDisabled,
      isStatic: isEditModeStatic,
      showDelete,
      style,
      isEditing,
      render: renderEditMode
    }
  }

  const viewModeProps = () => {
    return {
      label,
      handleDelete: _handleDelete,
      handleAddNew: _handleAddNew,
      renderBody: renderViewMode,
      showAdd,
      showEdit,
      showDelete,
      style,
      toggleMode: _toggleMode,
      value
    }
  }

  if (isEditing) {
    return cancelOnOutsideClick ? (
      <ClickOutside onClickOutside={_handleOutsideClick}>
        <EditMode {...editModeProps()} />
      </ClickOutside>
    ) : (
      <EditMode {...editModeProps()} />
    )
  }

  return <ViewMode {...viewModeProps()} />
}
