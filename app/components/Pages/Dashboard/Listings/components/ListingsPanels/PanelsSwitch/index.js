import React from 'react'
import { connect } from 'react-redux'
import { ButtonGroup } from 'react-bootstrap'

import SwitchButton from './SwitchButton'
import { setActivePanel } from '../../../../../../../store_actions/listings/panels'

const PanelsSwitch = ({ activePanel, setActivePanel, tabName }) => {
  const onClickHandler = panel => () => setActivePanel(tabName, panel)

  return (
    <ButtonGroup className="c-panels-switch">
      <SwitchButton
        icon="GLOBE"
        active={activePanel === 'map'}
        clickHandler={onClickHandler('map')}
      />
      <SwitchButton
        icon="LIST"
        active={activePanel === 'table'}
        clickHandler={onClickHandler('table')}
      />
      <SwitchButton
        icon="GRID"
        active={activePanel === 'grid'}
        clickHandler={onClickHandler('grid')}
      />
    </ButtonGroup>
  )
}

export default connect(null, { setActivePanel })(PanelsSwitch)
