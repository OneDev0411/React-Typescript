import React, { useState, useRef, useEffect } from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { NotEditable } from './NotEditable'

const sharedStyles = {
  top: 'calc(100% + 1rem)'
}

const inputStyles = {
  backgroundColor: '#d2e5f2',
  border: '1px solid #ccc',
  top: 0,
  left: 0
}

export function AddressField({
  deal,
  upsertContexts,
  onAddressUpdate,
  annotations,
  formValues,
  ...inputProps
}) {
  const formRef = useRef(null)
  const [inputValue, setInputValue] = useState(inputProps.value)

  useEffect(() => {
    setInputValue(inputProps.value)
  }, [inputProps.value])

  if (deal.listing) {
    return <NotEditable style={inputProps.style} value={inputProps.value} />
  }

  const handleSaveAddress = async address => {
    // update form values
    onAddressUpdate(address)

    // close form
    formRef.current.handleClose()
  }

  const handleClickInput = () => {
    const { context } = inputProps.annotation

    if (['full_address', 'street_address'].includes(context)) {
      return
    }

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

    formRef.current.handleOpenForm(addressFields.full_address || addressFields)
  }

  return (
    <InlineAddressField
      ref={formRef}
      handleSubmit={handleSaveAddress}
      suggestionsStyle={sharedStyles}
      formStyle={{
        ...sharedStyles,
        ...calculateFormPosition(inputProps.rect)
      }}
      style={{
        position: 'absolute',
        top: inputProps.style.top,
        left: inputProps.style.left,
        width: Math.max(inputProps.rect.width, 300)
      }}
      renderSearchField={addressProps => (
        <input
          key={inputProps.rectIndex}
          {...addressProps}
          value={inputValue}
          onChange={e => {
            addressProps.onChange(e)
            setInputValue(e.target.value)
          }}
          onClick={handleClickInput}
          style={{
            ...inputProps.style,
            ...inputStyles
          }}
        />
      )}
    />
  )
}

function calculateFormPosition(bounds) {
  const ww = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )

  const percent = (bounds.right * 100) / ww

  if (percent > 60) {
    return {
      left: 'auto',
      right: 0
    }
  }

  return {
    left: 0,
    right: 'auto'
  }
}
