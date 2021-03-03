import Fetch from '../../../services/fetch'

export interface Filters extends IContactFilterOptions {
  attributes?: IContactAttributeFilter[]
}

export const bulkTag = async (tags: string[], filters: Filters) => {
  try {
    const response = await new Fetch()
      .put('/contacts/attributes/tags')
      .send({ tags, ...filters })

    return response.body
  } catch (error) {
    throw error
  }
}
