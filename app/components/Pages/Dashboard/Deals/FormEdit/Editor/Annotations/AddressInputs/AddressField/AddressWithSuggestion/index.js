import { useRef } from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { UnlinkFieldButton } from '../../../../../components/UnlinkFieldButton'

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
  onSave,
  onToggleUnlink
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
        <>
          <input
            key={rectIndex}
            {...addressProps}
            value={inputValue}
            className="field-unlinkable"
            onChange={e => {
              addressProps.onChange(e)
              onChange(e.target.value)
            }}
            style={{
              ...style,
              ...inputStyles
            }}
          />

          <UnlinkFieldButton
            style={{
              left: `${rect.width - 16}px`,
              top: `${rect.height / 10}px`,
              height: `${rect.height}px`
            }}
            onClick={onToggleUnlink}
          />
        </>
      )}
    />
  )
}
