import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import SwitchButton from './SwitchButton'
import { setActivePanel } from '../../../../../../store_actions/listings/panels'

const PanelsSwitch = ({ activePanel, setActivePanel, tabName }) => {
  const onClickHandler = panel => () => setActivePanel(tabName, panel)

  return (
    <Flex>
      <SwitchButton
        icon="LIST"
        active={activePanel === 'table'}
        onClick={onClickHandler('table')}
      />
      <SwitchButton
        icon="MAP"
        active={activePanel === 'map'}
        onClick={onClickHandler('map')}
      />
      <SwitchButton
        icon="GALLERY"
        active={activePanel === 'grid'}
        onClick={onClickHandler('grid')}
      />
    </Flex>
  )
}

export default connect(
  null,
  { setActivePanel }
)(PanelsSwitch)
