// actions/agents/get-report.js
import Agent from '../../models/Agent'
import AppStore from '../../stores/AppStore'

export default (user, criteria) => {
  AppStore.data.agents.searching = true
  delete AppStore.data.agents.agents
  delete AppStore.data.agents.rows
  AppStore.emitChange()

  const params = {
    access_token: user.access_token,
    criteria
  }
  Agent.getReport(params, (err, response) => {
    AppStore.data.agents.searching = false
    AppStore.data.agents.agents = response.data
    AppStore.emitChange()
  })
}