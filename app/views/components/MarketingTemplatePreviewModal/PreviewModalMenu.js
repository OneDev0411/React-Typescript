import React from 'react'

import { isTemplateInstance } from 'utils/marketing-center/helpers'

import Button from '../Button/ActionButton'

function PreviewModalMenu(props) {
  return (
    <Button onClick={props.handleAction}>
      {isTemplateInstance(props.selectedTemplate) ? 'Continue' : 'Customize'}
    </Button>
  )
}

export default PreviewModalMenu
