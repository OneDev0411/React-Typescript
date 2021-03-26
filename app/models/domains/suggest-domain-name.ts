import Fetch from 'services/fetch'

async function suggestDomainName(search: string) {
  return (await new Fetch().get(`/domains/suggest?q=${search}`)).body
    .data as IDomainSuggest[]
}

export default suggestDomainName
