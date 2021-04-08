import Fetch from 'services/fetch'

async function getStripeCustomers() {
  return (await new Fetch().get('/payments/stripe/customers')).body
    .data as IStripeCustomer[]
}

export default getStripeCustomers
