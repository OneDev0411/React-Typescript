// import Fetch from 'services/fetch'

async function suggestDomainName(search: string) {
  // return (await new Fetch().get(`/domains/suggest?q=${search}`)).body
  //   .data as IDomainSuggest[]

  // try {
  //   await new Fetch().get(`/domains/suggest?q=${search}`)
  // } catch (e) {}

  await new Promise(resolve => setTimeout(resolve, 3000))

  return [
    {
      available: true,
      domain: `${search}1.com`,
      definitive: true,
      price: 47990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}2.org`,
      definitive: true,
      price: 57990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}3.net`,
      definitive: true,
      price: 67990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}4.com`,
      definitive: true,
      price: 47990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}5.org`,
      definitive: true,
      price: 57990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}6.net`,
      definitive: true,
      price: 67990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}7.com`,
      definitive: true,
      price: 47990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}8.org`,
      definitive: true,
      price: 57990000,
      currency: 'USD',
      period: 1
    },
    {
      available: true,
      domain: `${search}9.net`,
      definitive: true,
      price: 67990000,
      currency: 'USD',
      period: 1
    }
  ] as IDomainSuggest[]
}

export default suggestDomainName
