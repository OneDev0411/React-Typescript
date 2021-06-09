import Fetch from 'services/fetch'

async function updateShowing(
  showingId: UUID,
  data: Omit<IShowingInput, 'roles'>
) {
  // TODO: fix the response type
  return (
    await new Fetch({ proxy: false }).put(`/showings/${showingId}`).send(data)
  ).body.data as IShowing
}

export default updateShowing
