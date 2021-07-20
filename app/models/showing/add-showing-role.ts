import Fetch from 'services/fetch'

async function addShowingRole(
  showingId: UUID,
  data: IShowingRoleInput
): Promise<IShowingRole> {
  return (await new Fetch().post(`/showings/${showingId}/roles`).send(data))
    .body.data
}

export default addShowingRole
