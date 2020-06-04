import Fetch from '../../../services/fetch'

export async function dismissAllMergeClusters() {
  try {
    return await new Fetch().delete('/contacts/duplicates/all').send()
  } catch (error) {
    throw error
  }
}
