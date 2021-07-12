import React, { ReactNode, useState, useRef } from 'react'
import ClickOutside from 'react-click-outside'

import { noop } from 'utils/helpers'

import { ViewMode } from './ViewMode'
import { EditMode, Props as EditModeProps } from './EditMode'

interface Props {
  error?: string
  value?: string
  label?: string
  style?: object
  showAdd?: boolean
  isEditing: boolean
  showEdit?: boolean
  showDelete?: boolean
  isDisabled?: boolean
  attributeName?: string
  isPopoverMode?: boolean
  isEditModeStatic?: boolean
  contact?: INormalizedContact
  cancelOnOutsideClick?: boolean
  toggleMode: () => void
  handleCancel?: () => void
  handleDelete?: () => void
  handleAddNew?: () => void
  renderViewMode?: () => void
  handleOutsideClick?: () => void
  handleSave: (callback: () => void) => void
  renderEditMode: (props: Pick<EditModeProps, 'error'>) => ReactNode
}

export const InlineEditableField = (props: Props) => {
  const {
    contact,
    isEditing,
    value = '',
    error = '',
    style = {},
    label = 'Label',
    showAdd = false,
    showEdit = true,
    showDelete = true,
    attributeName = '',
    isDisabled = false,
    isPopoverMode = false,
    isEditModeStatic = false,
    cancelOnOutsideClick = false,
    renderEditMode,
    handleSave: onSave,
    renderViewMode = noop,
    handleCancel: onCancel,
    toggleMode: onToggleMode,
    handleDelete: onDelete = noop,
    handleAddNew: onAddNew = noop,
    handleOutsideClick: onOutsideClick
  } = props
  const popoverEditContainerRef = useRef<Nullable<HTMLDivElement>>(null)
  const [ref, setRef] = useState<Nullable<HTMLElement>>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleToggleMode = event => {
    event.stopPropagation()

    if (isPopoverMode) {
      setRef(event.currentTarget)
    }

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
      setIsSaving(true)
      await onSave(() => setRef(null))
    } catch (error) {
      throw error
    } finally {
      setIsSaving(false)
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
      style,
      error,
      contact,
      isSaving,
      isEditing,
      handleSave,
      isDisabled,
      showDelete,
      viewRef: ref,
      handleCancel,
      isPopoverMode,
      render: renderEditMode,
      handleDelete: onDelete,
      isStatic: isEditModeStatic,
      onClosePopover: () => setRef(null),
      popoverContainerRef: popoverEditContainerRef?.current
    }
  }

  const viewModeProps = () => {
    return {
      style,
      value,
      label,
      contact,
      showAdd,
      showEdit,
      showDelete,
      attributeName,
      handleDelete,
      handleAddNew,
      renderBody: renderViewMode,
      toggleMode: handleToggleMode
    }
  }
  const ViewModeRenderer = <ViewMode {...viewModeProps()} />
  const EditModeRenderer = <EditMode {...editModeProps()} />

  if (isPopoverMode) {
    return (
      <div ref={popoverEditContainerRef}>
        {ViewModeRenderer}
        {EditModeRenderer}
      </div>
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
