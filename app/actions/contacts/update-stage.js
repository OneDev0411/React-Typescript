import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user, id, stage_id, stage) {
  const params = {
    id,
    stage: stage.replace(/\s/g, ''),
    stage_id,
    access_token: user.access_token
  }

  try {
    const response = await Contact.updateStage(params)
    if (response.status === 200) {
      AppStore.data.contacts[id] = {
        ...response.body.data,
        ...{ timeline: AppStore.data.contacts[id].timeline }
      }
    }
  }
  catch(e) {
    console.log(e)
  }
}
