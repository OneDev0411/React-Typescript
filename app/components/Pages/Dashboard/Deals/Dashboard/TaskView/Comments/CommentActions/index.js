import React from 'react'

import Agent from './Agent'
import BackOffice from './BackOffice'

export default function CallToAction({
  task,
  isBackoffice,
  hasComment,
  isSaving,
  onSendComment
}) {
  const props = {
    task,
    hasComment,
    onSendComment,
    isSaving
  }

  return isBackoffice ? <BackOffice {...props} /> : <Agent {...props} />
}
