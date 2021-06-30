import Fetch from 'services/fetch'

async function updateShowing(
  showingId: UUID,
  data: Omit<IShowingInput, 'roles'>
): Promise<IShowing> {
  return (
    await new Fetch({ proxy: false }).put(`/showings/${showingId}`).send(data)
  ).body.data
}

export default updateShowing
