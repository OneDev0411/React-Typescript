// actions/agents/get-report.js
import Agent from '../../models/Agent'
import AppStore from '../../stores/AppStore'

export default (user, criteria) => {
  AppStore.data.agent_report = {
    searching: true,
    agents:[]
  }
  AppStore.emitChange()
  
  const params = {
    access_token: user.access_token,
    criteria
  }
  Agent.getReport(params, (err, response) => {
    delete AppStore.data.agent_report.searching
    AppStore.data.agent_report.agents = response.data
    AppStore.emitChange()
  })
}