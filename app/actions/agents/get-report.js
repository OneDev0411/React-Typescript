// actions/agents/get-report.js
import Agent from '../../models/Agent'
import AppStore from '../../stores/AppStore'

export default (user, criteria) => {
  AppStore.data.agent_report = {}
  const params = {
    access_token: user.access_token,
    criteria
  }
  Agent.getReport(params, (err, response) => {
    AppStore.data.agent_report = response.data
    AppStore.emitChange()
  })
}