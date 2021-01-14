import type {
  Stripe,
  StripeCardNumberElement,
  StripeError,
  Token
} from '@stripe/stripe-js'

import createStripeCustomer from './create-stripe-customer'

import deleteStripeCustomer from './delete-stripe-customer'

export interface CreateStripeToken {
  token?: Token
  error?: StripeError
  customer?: IStripeCustomer
}

async function createStripeToken(
  stripe: Stripe,
  cardNumberElement: StripeCardNumberElement,
  name: string,
  lastPaymentId?: string
): Promise<CreateStripeToken> {
  const result = await stripe.createToken(cardNumberElement, {
    name
  })

  if (result.error || !result.token) {
    return result
  }

  if (lastPaymentId) {
    await deleteStripeCustomer(lastPaymentId)
  }

  const customer = await createStripeCustomer(result.token.id)

  return {
    ...result,
    customer
  }
}

export default createStripeToken
