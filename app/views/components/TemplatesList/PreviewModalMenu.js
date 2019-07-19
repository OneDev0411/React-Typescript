import React from 'react'

import Button from 'components/Button/ActionButton'

import { itemButtonText } from './helpers'

function PreviewModalMenu(props) {
  return (
    <Button onClick={props.handlePreviewShare}>
      {itemButtonText(props.selectedTemplate)}
    </Button>
  )
}

export default PreviewModalMenu
