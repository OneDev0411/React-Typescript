import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { upsertContexts } from 'actions/deals'
import { normalizeAddress } from 'models/Deal/helpers/normalize-address'
import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

const componentStyle = {
  top: 'calc(100% + 1rem)'
}

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
      // address={inputProps.value}
      ref={formRef}
      handleSubmit={handleSaveAddress}
      suggestionsStyle={componentStyle}
      formStyle={componentStyle}
      style={{
        top: inputProps.style.top,
        left: inputProps.style.left,
        maxWidth: '20rem'
      }}
      renderSearchField={addressProps => (
        <input
          {...inputProps}
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

export default connect(
  null,
  { upsertContexts }
)(AddressField)
