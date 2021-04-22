import Fetch from 'services/fetch'

async function getShowing(showingId: UUID) {
  return (
    await new Fetch().get(`/showings/${showingId}`).query({
      associations: [
        'showing.listing',
        'showing.deal',
        'showing.deal.listing',
        'showing.appointments'
      ]
    })
  ).body.data as IShowing
}

export default getShowing
