import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { upsertContexts } from 'actions/deals'
import { normalizeAddress } from 'models/Deal/helpers/normalize-address'
import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

function AddressField({
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
    const normalized = normalizeAddress(address)

    _.each(address, (item, name) => {
      normalized[name] = typeof item === 'object' ? item.value : item
    })

    const contexts = _.map(normalized, (value, name) =>
      createUpsertObject(deal, name, value, true)
    ).filter(value => value)

    // update form values
    onAddressUpdate(normalized)

    // save contexts
    await upsertContexts(deal.id, contexts)

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

export default connect(
  null,
  { upsertContexts }
)(AddressField)
