import React, { FormEvent, useState } from 'react'

import { Button } from '@material-ui/core'

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

import { useDispatch } from 'react-redux'

import { addNotification as notify } from 'components/notification'

import createStripeToken, {
  CreateStripeToken
} from 'models/payments/create-stripe-token'
import useAsync from 'hooks/use-async'

import { useWizardForm } from 'components/QuestionWizard/use-context'

import useSafeDispatch from 'hooks/use-safe-dispatch'

import DomainPaymentActions from './DomainPaymentActions'
import DomainPaymentFormCardField from './DomainPaymentFormCardField'

interface DomainPaymentFormProps {
  domainPrice: string
  lastPaymentId?: string
  onCancelClick?: () => void
  onPayClick: (stripeCustomerId: string, done: () => void) => void
  disabled: boolean
}

function DomainPaymentForm({
  domainPrice,
  lastPaymentId,
  onCancelClick,
  onPayClick,
  disabled
}: DomainPaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const wizard = useWizardForm()
  // Two requests needed to complete the buying process and the text field
  // blinks after the first request and before starting the next one.
  // So we need to have a disabled state and handle it manually to avoid
  // this issue
  const [fieldDisabled, setFieldDisabled] = useState(false)
  const { run, data, setData, isLoading } = useAsync<CreateStripeToken>()
  const dispatch = useDispatch()

  const setFieldDisabledSafe = useSafeDispatch(setFieldDisabled)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return
    }

    setData(null)

    wizard.setShowLoading(true)

    setFieldDisabled(true)

    const done = () => setFieldDisabledSafe(false)

    run(async () => createStripeToken(stripe, cardElement, lastPaymentId)).then(
      result => {
        if (result.customer) {
          onPayClick(result.customer.id, done)
        }
      },
      () => {
        wizard.setShowLoading(false)
        done()
        dispatch(
          notify({
            message:
              'An error happened on sending data to stripe, please try again',
            status: 'error'
          })
        )
      }
    )
  }

  const fieldErrorText = data?.error?.message

  return (
    <form onSubmit={handleSubmit}>
      <DomainPaymentFormCardField
        fullWidth
        error={!!fieldErrorText}
        helperText={fieldErrorText}
        disabled={isLoading || disabled || fieldDisabled}
      />

      <DomainPaymentActions
        disabled={!stripe || isLoading || disabled}
        domainPrice={domainPrice}
      >
        {onCancelClick && (
          <Button
            type="button"
            color="secondary"
            variant="outlined"
            onClick={onCancelClick}
            disabled={isLoading || disabled}
          >
            Cancel
          </Button>
        )}
      </DomainPaymentActions>
    </form>
  )
}

export default DomainPaymentForm
