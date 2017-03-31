// actions/get-content.js
import AppStore from '../../stores/AppStore'
import Cosmic from 'cosmicjs'
import _ from 'lodash'
import config from '../../../config/public'

export default (slug, rendered, res, callback) => {
  callback = callback || function() {}

  Cosmic.getObject(config.cosmicjs, { slug }, (err, response) => {
    if (!response || response.object)
      return callback()

    const metafields = response.object.metafields

    if (slug === 'landing-page') {
      const subheadline = _.find(metafields, { key: 'subheadline' }).value
      const call_to_action = _.find(metafields, { key: 'call-to-action' }).value
      const placeholder_text = _.find(metafields, { key: 'placeholder-text' }).value

      AppStore.data.content = {
        subheadline,
        call_to_action,
        placeholder_text
      }

      AppStore.data.initial_text = 'smarter'

      if (rendered === 'server') {
        res.locals.page_slug = 'landing'
        res.locals.AppStore = JSON.stringify(AppStore)
      }
    }

    AppStore.emitChange()

    if (callback)
      callback()
  })
}
