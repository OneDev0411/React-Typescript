import { useState } from 'react'

import { AddressPopover } from 'components/inline-editable-fields/InlineAddressField/AddressPopover'
import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { UnlinkFieldButton } from '../../../../../components/UnlinkFieldButton'

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

  return (
    <div>
      <div
        style={{
          ...style,
          ...inputStyles,
          position: 'absolute',
          top: style.top,
          left: style.left,
          width: rect.width,
          display: 'flex',
          alignItems: 'center'
        }}
        className="field-unlinkable"
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
      <UnlinkFieldButton
        style={{
          left: `${rect.left + rect.width - 16}px`,
          top: `${rect.top + rect.height / 10}px`,
          height: `${rect.height}px`
        }}
        onClick={onToggleUnlink}
      />
    </div>
  )
}
