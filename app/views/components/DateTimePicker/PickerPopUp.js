import React from 'react'
import ClickOutSide from 'react-click-outside'

import { PickerContainer } from './styled'

function PickerPopUp(props) {
  return (
    props.isPopUpOpen && (
      <div style={{ position: 'relative' }}>
        <ClickOutSide onClickOutside={props.onClose}>
          <PickerContainer popUpPosition={props.popUpPosition}>
            {props.children}
          </PickerContainer>
        </ClickOutSide>
      </div>
    )
  )
}

export default PickerPopUp
