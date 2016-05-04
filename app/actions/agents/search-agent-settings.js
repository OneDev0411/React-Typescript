// actions/agents/search-agent-settings.js
import Agent from '../../models/Agent'
import AppStore from '../../stores/AppStore'

export default mlsid => {
  const params = {
    mlsid
  }
  Agent.search(params, (err, response) => {
    if (response.status === 'success') {
      const agent = response.data
      if (!AppStore.data.settings)
        AppStore.data.settings = {}
      AppStore.data.settings.agent = agent
    } else {
      AppStore.data.error_type = 'agent-not-found'
      AppStore.data.show_message = true
      AppStore.data.errors = true
    }
    delete AppStore.data.submitting
    AppStore.emitChange()
  })
}