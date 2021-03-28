import Fetch from 'services/fetch'

async function getDomainAgreements(domain: string) {
  return (await new Fetch().get(`/domains/agreements?domain=${domain}`)).body
    .data as IDomainAgreement[]
}

export default getDomainAgreements
