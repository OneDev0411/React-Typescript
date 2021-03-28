import Fetch from 'services/fetch'

async function deleteStripeCustomer(id: string) {
  await new Fetch().delete(`/payments/stripe/customers/${id}`)
}

export default deleteStripeCustomer
