import Fetch from '../../../services/fetch'

export async function disconnectDocuSign(): Promise<any> {
  const response = await new Fetch().delete('/users/self/docusign').send()

  return response.body?.data
}
