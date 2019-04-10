import React from 'react'
import ClickOutSide from 'react-click-outside'

import { PickerContainer } from './styled'

function PickerPopUp(props) {
  const { isPopUpOpen, onClose, popUpPosition, children } = props

  return (
    isPopUpOpen && (
      <div style={{ position: 'relative' }}>
        <ClickOutSide onClickOutside={onClose}>
          <PickerContainer depth={3} popUpPosition={popUpPosition}>
            {children}
          </PickerContainer>
        </ClickOutSide>
      </div>
    )
  )
}

export default PickerPopUp
