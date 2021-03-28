interface IStripeCustomer extends IModel<'stripe_customer'> {
  customer_id: UUID
  owner: UUID
  source: {
    address_city: Nullable<string>
    address_country: Nullable<string>
    address_line1: Nullable<string>
    address_line1_check: Nullable<string>
    address_line2: Nullable<string>
    address_state: Nullable<string>
    address_zip: Nullable<string>
    address_zip_check: Nullable<string>
    brand: string
    country: string
    customer: string
    cvc_check: 'pass'
    dynamic_last4: Nullable<string>
    exp_month: number
    exp_year: number
    fingerprint: string
    funding: 'credit'
    id: string
    last4: string
    metadata: object
    name: string
    object: 'card'
    tokenization_method: Nullable<string>
  }
}
