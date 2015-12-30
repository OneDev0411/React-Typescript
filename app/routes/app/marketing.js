// marketing.js
import _ from 'lodash'

// Content
import Cosmic from 'cosmicjs'

// Store
import AppStore from '../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

module.exports = (app, config, req, res, callback) => {
  // Add marketing / server-side page content here
  if(req.url !== '/')
    return callback()
  else {
    Cosmic.getObject(config.cosmicjs, { slug: 'landing-page' }, (err, response) => {
      const metafields = response.object.metafields
      const subheadline = _.findWhere(metafields, { key: 'subheadline' }).value
      const call_to_action = _.findWhere(metafields, { key: 'call-to-action' }).value
      const placeholder_text = _.findWhere(metafields, { key: 'placeholder-text' }).value 
      AppStore.data.content = {
        subheadline,
        call_to_action,
        placeholder_text
      }
      AppDispatcher.dispatch({
        action: 'init-landing'
      })
      res.locals.page_slug = 'landing'
      res.locals.AppStore = JSON.stringify(AppStore)
      AppStore.emitChange()
      return callback()
    })
  }
}