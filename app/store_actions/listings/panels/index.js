import SET_ACTIVE_PANEL from '../../../constants/listings/panels'

const setActivePanel = (tabName, panelName) => ({
  tabName,
  panelName,
  type: SET_ACTIVE_PANEL
})

export default setActivePanel
