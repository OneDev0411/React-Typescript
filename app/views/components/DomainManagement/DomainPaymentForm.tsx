import React, { FormEvent } from 'react'

import { Button } from '@material-ui/core'

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

import createStripeToken, {
  CreateStripeToken
} from 'models/payments/create-stripe-token'
import useAsync from 'hooks/use-async'

import { useWizardForm } from 'components/QuestionWizard/use-context'

import DomainPaymentActions from './DomainPaymentActions'
import DomainPaymentFormCardField from './DomainPaymentFormCardField'

interface DomainPaymentFormProps {
  domainPrice: string
  lastPaymentId?: string
  onCancelClick?: () => void
  onPayClick: (stripeCustomerId: string) => void
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
  const { run, data, setData, isLoading } = useAsync<CreateStripeToken>()

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

    run(async () => createStripeToken(stripe, cardElement, lastPaymentId)).then(
      result => {
        if (result.customer) {
          onPayClick(result.customer.id)
        }
      },
      () => wizard.setShowLoading(false)
    )
  }

  const fieldErrorText = data?.error?.message

  return (
    <form onSubmit={handleSubmit}>
      <DomainPaymentFormCardField
        fullWidth
        error={!!fieldErrorText}
        helperText={fieldErrorText}
        disabled={isLoading || disabled}
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
