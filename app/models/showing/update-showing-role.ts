import Fetch from 'services/fetch'

async function updateShowingRole(
  showingId: UUID,
  showingRoleId: UUID,
  data: IShowingRoleInput
): Promise<void> {
  await new Fetch()
    .put(`/showings/${showingId}/roles/${showingRoleId}`)
    .query({
      'associations[]': ['showing.roles', 'showing_role.agent', 'agent.office']
    })
    .send(data)
}

export default updateShowingRole
