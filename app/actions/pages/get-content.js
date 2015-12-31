// actions/show-modal.js
import AppStore from '../../stores/AppStore'
import Cosmic from 'cosmicjs'
import _ from 'lodash'
import config from '../../../config/public'

// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

export default (slug, rendered, res, callback) => {
  Cosmic.getObject(config.cosmicjs, { slug }, (err, response) => {
    const metafields = response.object.metafields
    if (slug === 'landing-page') {
      const subheadline = _.findWhere(metafields, { key: 'subheadline' }).value
      const call_to_action = _.findWhere(metafields, { key: 'call-to-action' }).value
      const placeholder_text = _.findWhere(metafields, { key: 'placeholder-text' }).value
      AppStore.data.content = {
        subheadline,
        call_to_action,
        placeholder_text
      }
      if (rendered === 'server') {
        res.locals.page_slug = 'landing'
        res.locals.AppStore = JSON.stringify(AppStore)
      }
      AppDispatcher.dispatch({
        action: 'init-landing'
      })
    }
    AppStore.emitChange()
    if (callback)
      callback()
  })
}