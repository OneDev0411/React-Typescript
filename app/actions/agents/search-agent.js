// actions/agents/search-agent.js
import Agent from '../../models/Agent'
import AppStore from '../../stores/AppStore'

export default mlsid => {
  AppStore.data.signup.searching = true
  AppStore.emitChange()
  const params = {
    mlsid
  }
  Agent.search(params, (err, response) => {
    if (response.status === 'success') {
      const agent = response.data
      AppStore.data.signup.agent = agent
    } else {
      AppStore.data.error_type = 'agent-not-found'
      AppStore.data.show_message = true
      AppStore.data.errors = true
    }
    delete AppStore.data.submitting
    AppStore.emitChange()
  })
}