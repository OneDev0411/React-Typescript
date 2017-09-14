import React from 'react'
import { connect } from 'react-redux'
import AgentCta from './agent-cta'
import BackOfficeCta from './backoffice-cta'

const CallToAction = ({
  task,
  isBackoffice,
  hasComment,
  onSendComment
}) => {
  const props = { task, hasComment, onSendComment }

  return isBackoffice ?
    <BackOfficeCta {...props} /> :
    <AgentCta {...props} />
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(CallToAction)
