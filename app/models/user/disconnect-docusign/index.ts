import Fetch from '../../../services/fetch'

export async function disconnectDocuSign(): Promise<any> {
  try {
    await new Fetch().delete('/users/self/docusign').send()
  } catch (err) {
    throw err
  }
}
