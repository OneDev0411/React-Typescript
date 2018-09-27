import React from 'react'

import IconUnSelectedRadio from './UnSelectedRadio/IconUnSelectedRadio'
import IconSelectedRadio from './SelectedRadio/IconSelectedRadio'

function RadioIcon(props) {
  if (props.selected) {
    return <IconSelectedRadio />
  }

  return <IconUnSelectedRadio />
}

export default RadioIcon
