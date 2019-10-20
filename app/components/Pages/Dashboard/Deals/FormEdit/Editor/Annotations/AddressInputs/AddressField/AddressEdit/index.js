import React, { useState } from 'react'

import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { AddressPopover } from 'components/inline-editable-fields/InlineAddressField/AddressPopover'

export function AddressEdit({
  rect,
  inputValue,
  inputStyles,
  style,
  annotations,
  formValues,
  onSave
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
      onClick={handleEdit}
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
