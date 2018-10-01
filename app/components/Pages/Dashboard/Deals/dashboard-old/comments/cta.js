import React from 'react'
import { connect } from 'react-redux'
import AgentCta from './agent-cta'
import BackOfficeCta from './backoffice-cta'

import { isBackOffice } from '../../../../../../utils/user-teams'

const CallToAction = ({
  task,
  isBackoffice,
  hasComment,
  isSaving,
  onSendComment
}) => {
  const props = {
    task,
    hasComment,
    onSendComment,
    isSaving
  }

  return isBackoffice ? <BackOfficeCta {...props} /> : <AgentCta {...props} />
}

export default connect(({ user }) => ({
  isBackoffice: isBackOffice(user)
}))(CallToAction)
