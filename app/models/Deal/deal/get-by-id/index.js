import Fetch from '../../../../services/fetch'

/**
 * get deal by id
 */
export async function getById(id) {
  try {
    const response = await new Fetch()
      .get(`/deals/${id}`)
      .query({ 'associations[]': ['room.attachments'] })
      .query({ 'associations[]': ['deal.checklists'] })
      .query({ 'associations[]': ['deal.envelopes'] })
      .query({ 'associations[]': ['room.latest_activity'] })
      .query({ 'associations[]': ['deal.files'] })
      .query({ 'associations[]': ['deal.brand'] })
      .query({ 'associations[]': ['user.agent'] })
      .query({ 'associations[]': ['user.docusign'] })
      .query({ 'associations[]': ['deal_role.agent'] })
      .query({ 'associations[]': ['agent.office'] })

    return response.body.data
  } catch (e) {
    throw e
  }
}
