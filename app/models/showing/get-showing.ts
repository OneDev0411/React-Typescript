import Fetch from 'services/fetch'

async function getShowing(showingId: UUID): Promise<IShowing> {
  return (
    await new Fetch().get(`/showings/${showingId}`).query({
      associations: [
        'showing.listing',
        'showing.deal',
        'showing_deal.listing',
        'showing.appointments',
        'showing_appointment.contact',
        'showing_appointment.approvals',
        'showing_approval.role',
        // TODO: needs an association here for showing_approval_role.user
        'showing.roles',
        'showing_appointment.notifications',
        'showing.availabilities'
      ]
    })
  ).body.data
}

export default getShowing
