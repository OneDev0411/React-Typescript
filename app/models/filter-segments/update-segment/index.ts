import Fetch from '../../../services/fetch'

async function updateSegment(namespace, segment: IContactList, query = {}) {
  try {
    const body = { ...segment, filters: segment.filters || [] }

    // @ts-ignore
    delete body.flows
    // @ts-ignore
    delete body.crm_tasks

    const response = await new Fetch()
      .put(`/${namespace}/lists/${segment.id}`)
      .send(body)
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}

export default updateSegment
