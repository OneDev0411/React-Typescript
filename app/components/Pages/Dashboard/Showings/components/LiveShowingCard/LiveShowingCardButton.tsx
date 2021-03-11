import React from 'react'

import SplitButton from 'components/SplitButton'

import LiveShowingCardButtonMenu from './LiveShowingCardButtonMenu'

function LiveShowingCardButton() {
  const handleClick = () => {
    // TODO: implement this method
    console.log('LiveShowingCardButton::click')
  }

  return (
    <SplitButton
      onClick={handleClick}
      RenderMenu={LiveShowingCardButtonMenu}
      size="small"
    >
      Open Booking Page
    </SplitButton>
  )
}

export default LiveShowingCardButton
