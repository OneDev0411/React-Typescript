import React, { useRef } from 'react'
import { CardElement, CardElementProps } from '@stripe/react-stripe-js'
import {
  StripeCardElement,
  StripeCardElementChangeEvent
} from '@stripe/stripe-js'

export interface DomainPaymentFormCardElementProps
  extends Omit<CardElementProps, 'options'> {
  disabled?: boolean
}

function DomainPaymentFormCardElement({
  onFocus,
  onChange,
  disabled,
  ...otherProps
}: DomainPaymentFormCardElementProps) {
  const inputRef = useRef<StripeCardElement | null>(null)

  const handleReady = (element: StripeCardElement) => {
    inputRef.current = element
  }

  const handleChange = (event: StripeCardElementChangeEvent) => {
    // Material-ui expects the onChange event has the target property
    if (inputRef.current) {
      const newEvent = {
        ...event,
        target: inputRef.current
      } as StripeCardElementChangeEvent

      onChange?.(newEvent)
    }
  }

  const handleFocus = () => {
    // Material-ui expects the onFocus event has the stopPropagation method
    onFocus?.call(this, { stopPropagation: () => {} })
  }

  return (
    <CardElement
      {...otherProps}
      options={{
        style: { base: { fontSize: '16px' } },
        disabled
      }}
      onReady={handleReady}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
}

export default DomainPaymentFormCardElement
