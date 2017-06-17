import React from 'react'

import GridView from './GridView'
import ListView from './ListView'
import PanelsSwitch from './PanelsSwitch'
import PanelHeader from './PanelHeader'

const getPanelContent = (panel, props) => {
  if (panel === 'list') {
    return <ListView {...props} />
  }
  return <GridView {...props} />
}

const ListingPanel = props => {
  const { activePanel, listings, tabName } = props
  let panelContainerClassName = 'l-listings__panel__container'
  let content

  if (activePanel !== 'map') {
    panelContainerClassName += ` ${panelContainerClassName}--full`
  }

  return (
    <div>
      <PanelsSwitch activePanel={activePanel} tabName={tabName} />
      <div className={panelContainerClassName}>
        <PanelHeader info={listings.info} />
        <div className="c-panel__list-container">
          {getPanelContent(activePanel, props)}
        </div>
      </div>
    </div>
  )
}

export default ListingPanel
