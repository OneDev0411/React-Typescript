import React, { useState } from 'react'

import { useSingleAndDoubleClick } from '@app/hooks/use-single-and-double-click'
import { AddressPopover } from 'components/inline-editable-fields/InlineAddressField/AddressPopover'
import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

export function AddressEdit({
  rect,
  inputValue,
  inputStyles,
  style,
  annotations,
  formValues,
  onSave,
  onToggleUnlink
}) {
  const [address, setAddress] = useState(null)

  const handleClose = e => {
    e.stopPropagation()

    setAddress(null)
  }

  const handleSave = address => {
    setAddress(null)
    onSave(address)
  }

  const handleEdit = () => {
    const addressFields = getAnnotationsByType(annotations, 'addresses').reduce(
      (acc, group) => {
        const value = group
          .map(item => formValues[item.annotation.fieldName])
          .join(' ')

        return {
          ...acc,
          [group[0].context]: value
        }
      },
      {}
    )

    setAddress(addressFields.full_address || addressFields)
  }

  const onClick = useSingleAndDoubleClick(handleEdit, onToggleUnlink)

  return (
    <div
      style={{
        ...style,
        ...inputStyles,
        position: 'absolute',
        top: style.top,
        left: style.left,
        width: rect.width
      }}
      onClick={onClick}
    >
      <span>{inputValue}</span>

      <AddressPopover
        isOpen={address !== null}
        address={address}
        showDeleteButton={false}
        onSubmit={handleSave}
        onClose={handleClose}
      />
    </div>
  )
}
