import Fetch from 'services/fetch'

async function updateShowingRole(
  showingId: UUID,
  showingRoleId: UUID,
  data: IShowingRoleInputAPI
) {
  return (
    await new Fetch()
      .put(`/showings/${showingId}/roles/${showingRoleId}`)
      .query({
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
      .send(data)
  ).body.data as IShowing
}

export default updateShowingRole
