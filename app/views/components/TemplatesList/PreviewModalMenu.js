import React from 'react'

import Button from 'components/Button/ActionButton'

import { isTemplateInstance } from 'utils/marketing-center/helpers'

function PreviewModalMenu(props) {
  return (
    <Button onClick={props.handleAction}>
      {isTemplateInstance(props.selectedTemplate) ? 'Continue' : 'Customize'}
    </Button>
  )
}

export default PreviewModalMenu
