declare interface IDomainSuggest {
  available: boolean
  domain: string
  definitive: boolean
  price: number
  currency: 'USD'
  period: number
}

declare interface IDomainAgreement {
  agreementKey: string
  content: string
  title: string
  url: string
}
