// actions/deals/upload-file.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async function (id, user, file) {
  const params = {
    id,
    file,
    access_token: user.access_token
  }

  try {
    const response = await Deals.uploadFile(params)

    let files = AppStore.data.deals.list[id].files

    if (!files)
      files = []

    // Success
    if (response.status === 200) {
      files.push(response.body.data)
      AppStore.data.deals.list[id].files = files
    }

    AppStore.emitChange()
  }
  catch(e) {}
}
