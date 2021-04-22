import Fetch from 'services/fetch'

async function getShowings() {
  return (
    await new Fetch()
      .post('/showings/filter')
      .query({ associations: ['showing.listing', 'showing.deal'] })
  ).body.data as IShowing[]
}

export default getShowings
