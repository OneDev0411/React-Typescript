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
        'showing.roles',
        'showing_role.user',
        'showing_appointment.notifications',
        'showing.availabilities',
        'showing_role.agent',
        'agent.office'
      ]
    })
  ).body.data
}

export default getShowing
