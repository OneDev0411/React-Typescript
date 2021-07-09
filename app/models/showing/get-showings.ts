import Fetch from 'services/fetch'

async function getShowings(): Promise<IShowing[]> {
  return (
    await new Fetch().post('/showings/filter').query({
      associations: [
        'showing.listing',
        'showing.deal',
        'showing.roles',
        'showing.appointments',
        'showing_appointment.contact',
        'showing_appointment.approvals',
        'showing_approval.role',
        'showing_appointment.notifications'
      ]
    })
  ).body.data
}

export default getShowings
