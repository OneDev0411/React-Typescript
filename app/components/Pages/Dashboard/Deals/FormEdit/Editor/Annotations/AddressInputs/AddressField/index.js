import React, { Fragment, useState, useRef, useEffect } from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import Tooltip from 'components/tooltip'

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

  if (deal.listing) {
    return (
      <div
        style={{
          ...inputProps.style,
          cursor: 'not-allowed'
        }}
      >
        <Tooltip
          captionIsHTML
          isCustom={false}
          placement="bottom"
          multiline
          caption={
            <Fragment>
              <img src="/static/images/deals/lock.svg" alt="locked" />
              <div>
                Listing information can only be changed on MLS. Once changed,
                the update will be reflected here.
              </div>
            </Fragment>
          }
        >
          <span>{inputProps.value}</span>
        </Tooltip>
      </div>
    )
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
