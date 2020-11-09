import React, { ReactNode, useState } from 'react'
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
  isPopoverMode?: boolean
  label?: string
  renderViewMode?: () => void
  renderEditMode: (props: any) => ReactNode
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
    isPopoverMode = false,
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
  const [ref, setRef] = useState<HTMLElement | null>(null)

  const _toggleMode = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    const refValue = isEditing ? event.currentTarget : null

    setRef(refValue)
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
    if (isPopoverMode) {
      setRef(null)
    }

    if (typeof handleCancel === 'function') {
      handleCancel()
    } else {
      toggleMode()
    }
  }

  const _handleSave = async () => {
    await handleSave()

    if (isPopoverMode) {
      setRef(null)
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
      handleSave: _handleSave,
      handleDelete,
      isDisabled,
      isStatic: isEditModeStatic,
      isPopoverMode,
      showDelete,
      style,
      isEditing,
      viewRef: ref,
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
  const ViewModeRenderer = <ViewMode {...viewModeProps()} />
  const EditModeRenderer = <EditMode {...editModeProps()} />

  if (isPopoverMode) {
    return (
      <>
        {ViewModeRenderer}
        {EditModeRenderer}
      </>
    )
  }

  if (isEditing) {
    return cancelOnOutsideClick ? (
      <ClickOutside onClickOutside={_handleOutsideClick}>
        {EditModeRenderer}
      </ClickOutside>
    ) : (
      EditModeRenderer
    )
  }

  return ViewModeRenderer
}
