import React from 'react'

import Button from 'components/Button/ActionButton'

import { buttonTextForPreviewAction } from './helpers'

function PreviewModalMenu(props) {
  return (
    <Button onClick={props.handlePreviewShare}>
      {buttonTextForPreviewAction(props.selectedTemplate)}
    </Button>
  )
}

export default PreviewModalMenu
