import React, { ReactNode, useState } from 'react'
import ClickOutside from 'react-click-outside'

import { noop } from 'utils/helpers'

import { ViewMode } from './ViewMode'
import { EditMode, Props as EditModeProps } from './EditMode'

interface Props {
  error?: string
  cancelOnOutsideClick?: boolean
  handleCancel?: () => void
  handleOutsideClick?: () => void
  handleDelete?: () => void
  handleSave: () => void
  handleAddNew?: () => void
  isDisabled?: boolean
  isEditing: boolean
  isEditModeStatic?: boolean
  isPopoverMode?: boolean
  label?: string
  renderViewMode?: () => void
  renderEditMode: (props: Pick<EditModeProps, 'error'>) => ReactNode
  showAdd?: boolean
  showEdit?: boolean
  showDelete?: boolean
  style?: object
  toggleMode: () => void
  value?: string
}

export const InlineEditableField = (props: Props) => {
  const {
    handleOutsideClick: onOutsideClick,
    handleDelete: onDelete = noop,
    handleAddNew: onAddNew = noop,
    toggleMode: onToggleMode,
    handleCancel: onCancel,
    renderViewMode = noop,
    handleSave: onSave,
    cancelOnOutsideClick = false,
    isEditModeStatic = false,
    isDisabled = false,
    isPopoverMode = false,
    label = 'Label',
    showAdd = false,
    showDelete = true,
    showEdit = true,
    style = {},
    value = '',
    isEditing,
    error = '',
    renderEditMode
  } = props
  const [ref, setRef] = useState<HTMLElement | null>(null)

  const handleToggleMode = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    const refValue = isEditing ? event.currentTarget : null

    setRef(refValue)
    onToggleMode()
  }

  const handleAddNew = event => {
    event.stopPropagation()

    onAddNew()
  }

  const handleDelete = event => {
    event.stopPropagation()

    onDelete()
  }

  const handleCancel = () => {
    if (isPopoverMode) {
      setRef(null)
    }

    if (typeof onCancel === 'function') {
      onCancel()
    } else {
      onToggleMode()
    }
  }

  const handleSave = async () => {
    try {
      await onSave()

      if (isPopoverMode) {
        setRef(null)
      }
    } catch (error) {
      throw error
    }
  }

  const handleOutsideClick = () => {
    if (onOutsideClick) {
      onOutsideClick()
    } else if (onCancel) {
      onCancel()
    } else {
      onToggleMode()
    }
  }

  const editModeProps = () => {
    return {
      error,
      handleCancel,
      handleSave,
      handleDelete: onDelete,
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
      handleDelete,
      handleAddNew,
      renderBody: renderViewMode,
      showAdd,
      showEdit,
      showDelete,
      style,
      toggleMode: handleToggleMode,
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
      <ClickOutside onClickOutside={handleOutsideClick}>
        {EditModeRenderer}
      </ClickOutside>
    ) : (
      EditModeRenderer
    )
  }

  return ViewModeRenderer
}
