import React, { FormEvent } from 'react'

import { Button, Grid } from '@material-ui/core'

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js'

import createStripeToken, {
  CreateStripeToken
} from 'models/payments/create-stripe-token'
import useAsync from 'hooks/use-async'

interface DomainPaymentFormProps {
  lastPaymentId?: string
  onCancelClick?: () => void
  onPayClick: (stripeCustomerId: string) => void
  disabled: boolean
}

function DomainPaymentForm({
  lastPaymentId,
  onCancelClick,
  onPayClick,
  disabled
}: DomainPaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { run, data, error, isLoading } = useAsync<CreateStripeToken>()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardNumberElement = elements.getElement(CardNumberElement)

    if (!cardNumberElement) {
      return
    }

    const firstName = (event.currentTarget.elements.namedItem(
      'firstName'
    ) as HTMLInputElement).value
    const lastName = (event.currentTarget.elements.namedItem(
      'lastName'
    ) as HTMLInputElement).value

    run(async () =>
      createStripeToken(
        stripe,
        cardNumberElement,
        `${firstName} ${lastName}`,
        lastPaymentId
      )
    ).then(result => {
      if (result.customer) {
        onPayClick(result.customer.id)
      }
    })

    // const { error, token } = await stripe.createToken(cardNumberElement, {
    //   name: `${firstName} ${lastName}`
    // })

    // if (error) {
    //   setError(error)

    //   return
    // }

    // if (!token) {
    //   return
    // }

    // if (lastPaymentId) {
    //   await deleteStripeCustomer(lastPaymentId)
    // }

    // const newStripeCustomer = await createStripeCustomer(token.id)

    // onPayClick(newStripeCustomer.id)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12}>
          <CardNumberElement />
        </Grid>
        <Grid item xs={6}>
          First name:
          <input name="firstName" />
        </Grid>
        <Grid item xs={6}>
          Last name:
          <input name="lastName" />
        </Grid>
        <Grid item xs={6}>
          <CardExpiryElement />
        </Grid>
        <Grid item xs={6}>
          <CardCvcElement />
        </Grid>
        <Grid item xs={12}>
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
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={!stripe || isLoading || disabled}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      {data?.error?.message}
      {error}
    </form>
  )
}

export default DomainPaymentForm
