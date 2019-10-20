import React, { useRef } from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

const popoverStyles = {
  marginTop: '1rem'
}

export function AddressWithSuggestion({
  rect,
  inputValue,
  inputStyles,
  rectIndex,
  style,
  onChange,
  onSave
}) {
  const formRef = useRef(null)

  const handleSave = address => {
    onSave(address)

    formRef.current.handleClose()
  }

  return (
    <InlineAddressField
      ref={formRef}
      handleSubmit={handleSave}
      suggestionsStyle={popoverStyles}
      formStyle={popoverStyles}
      style={{
        position: 'absolute',
        top: style.top,
        left: style.left,
        width: Math.max(rect.width, 300)
      }}
      renderSearchField={addressProps => (
        <input
          key={rectIndex}
          {...addressProps}
          value={inputValue}
          onChange={e => {
            addressProps.onChange(e)
            onChange(e.target.value)
          }}
          style={{
            ...style,
            ...inputStyles
          }}
        />
      )}
    />
  )
}
