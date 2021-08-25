import Fetch from '@app/services/fetch'

export async function disconnectDocuSign(): Promise<void> {
  try {
    await new Fetch().delete('/users/self/docusign').send()
  } catch (err) {
    throw err
  }
}
