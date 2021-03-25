import Fetch from 'services/fetch'

async function createStripeCustomer(token: string) {
  return (
    await new Fetch().post('/payments/stripe/customers').send({
      token
    })
  ).body.data as IStripeCustomer
}

export default createStripeCustomer
