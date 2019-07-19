import Fetch from 'services/fetch'

export async function importGoogleContacts(
  redirect: string = window.location.href
): Promise<IGoogleContactsImport> {
  const response = await new Fetch().post('/users/self/google').send({
    redirect
  })

  return response.body && response.body.data
}
