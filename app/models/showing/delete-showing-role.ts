import Fetch from 'services/fetch'

async function deleteShowingRole(
  showingId: UUID,
  showingRoleId: UUID
): Promise<void> {
  await new Fetch().delete(`/showings/${showingId}/roles/${showingRoleId}`)
}

export default deleteShowingRole
