import Fetch from 'services/fetch'

async function createWebsite(userId: UUID) {
  return (
    await new Fetch().post('/websites').send({
      template: 'light',
      title: 'Website Title Test 2',
      template_instance: null,
      attributes: {},
      user: userId
    })
  ).body.data
}

export default createWebsite
