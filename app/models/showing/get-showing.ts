import Fetch from 'services/fetch'

async function getShowing(showingId: UUID) {
  return (
    await new Fetch({ proxy: false }).get(`/showings/${showingId}`).query({
      associations: [
        'showing.listing',
        'showing.deal',
        'showing_deal.listing',
        'showing.appointments',
        'showing_appointment.contact',
        'showing_appointment.approvals',
        'showing_approval.role',
        'showing.roles',
        'showing_appointment.notifications'
      ]
    })
  ).body.data as IShowing
}

export default getShowing
