import Fetch from 'services/fetch'

async function updateShowingRole(
  showingId: UUID,
  showingRoleId: UUID,
  data: IShowingRoleInput
): Promise<void> {
  await new Fetch()
    .put(`/showings/${showingId}/roles/${showingRoleId}`)
    .send(data)
}

export default updateShowingRole
