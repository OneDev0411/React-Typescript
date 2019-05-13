import React, { useState, useRef, useEffect } from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

export function AddressField({
  deal,
  upsertContexts,
  onAddressUpdate,
  ...inputProps
}) {
  const formRef = useRef(null)
  const [inputValue, setInputValue] = useState(inputProps.value)

  useEffect(() => {
    setInputValue(inputProps.value)
  }, [inputProps.value])

  const handleSaveAddress = async address => {
    // update form values
    onAddressUpdate(address)

    // close form
    formRef.current.handleFormCancel()
  }

  return (
    <InlineAddressField
      ref={formRef}
      handleSubmit={handleSaveAddress}
      suggestionsStyle={{
        top: 'calc(100% + 1rem)'
      }}
      formStyle={{
        top: 'calc(100% + 1rem)',
        ...calculateFormPosition(inputProps.rect)
      }}
      style={{
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
          style={{
            ...inputProps.style,
            top: 0,
            left: 0
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
