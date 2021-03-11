import React, { MouseEvent } from 'react'
import { MenuItem } from '@material-ui/core'

import type { RenderMenuProps } from 'components/SplitButton'

type LiveShowingCardButtonMenuProps = RenderMenuProps

function LiveShowingCardButtonMenu({
  closeMenu
}: LiveShowingCardButtonMenuProps) {
  const handleClick = (event: MouseEvent) => {
    // TODO: implement this function
    console.log('LiveShowingCardButtonMenu::click')
    closeMenu(event)
  }

  return (
    <>
      <MenuItem onClick={handleClick}>Copy Link</MenuItem>
      <MenuItem onClick={handleClick}>Customize Widget</MenuItem>
      <MenuItem onClick={handleClick}>Delete</MenuItem>
    </>
  )
}

export default LiveShowingCardButtonMenu
