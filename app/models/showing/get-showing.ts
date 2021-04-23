import Fetch from 'services/fetch'

async function getShowing(showingId: UUID) {
  return (
    await new Fetch({ proxy: false }).get(`/showings/${showingId}`).query({
      associations: [
        'showing.listing',
        'showing.deal',
        'showing.deal.listing',
        'showing.appointments',
        'showing_appointment.contact'
      ]
    })
  ).body.data as IShowing
}

export default getShowing
