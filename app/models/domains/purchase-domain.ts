import Fetch from 'services/fetch'

async function purchaseDomain(
  stripeCustomerId: string,
  domainName: string,
  agreementKeys: string[]
) {
  return (
    await new Fetch().post('/domains').send({
      stripe: stripeCustomerId,
      domain: domainName,
      agreement: {
        ip: '127.0.0.1',
        keys: agreementKeys
      }
    })
  ).body.data
}

export default purchaseDomain
