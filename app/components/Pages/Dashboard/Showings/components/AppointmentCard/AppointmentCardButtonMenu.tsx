import React, { MouseEvent } from 'react'
import { MenuItem } from '@material-ui/core'

import type { RenderMenuProps } from 'components/SplitButton'

type AppointmentCardButtonMenuProps = RenderMenuProps

function AppointmentCardButtonMenu({
  closeMenu
}: AppointmentCardButtonMenuProps) {
  const handleClick = (event: MouseEvent) => {
    // TODO: implement this function
    console.log('AppointmentCardButtonMenu::click')
    closeMenu(event)
  }

  return (
    <>
      <MenuItem onClick={handleClick}>Option 1</MenuItem>
      <MenuItem onClick={handleClick}>Option 2</MenuItem>
    </>
  )
}

export default AppointmentCardButtonMenu
