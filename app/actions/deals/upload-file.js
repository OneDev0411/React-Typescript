// actions/deals/upload-file.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default (id, user, file) => {
  const params = { id, user, file }

  // find deal index
  const index = _.findIndex(AppStore.data.deals, deal => deal.id === id)

  AppStore.data.deals[index].uploading = true
  AppStore.emitChange()

  Deals.uploadFile(params, (err, response) => {
    let files = AppStore.data.deals[index].files

    if (!files)
      files = []

    // Success
    if (response.status === 200) {
      files.push(response.body.data)
      AppStore.data.deals[index].files = files
    }

    // set uploading to false
    AppStore.data.deals[index].uploading = false

    AppStore.emitChange()
  })
}
