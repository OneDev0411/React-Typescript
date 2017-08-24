import React from 'react'
import { connect } from 'react-redux'
import AgentCta from './agent-cta'
import BackOfficeCta from './backoffice-cta'

const CallToAction = ({
  task,
  isBackoffice,
  onSendComment
}) => {
  const props = { task, onSendComment }

  return isBackoffice ?
    <BackOfficeCta {...props} /> :
    <AgentCta {...props} />
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(CallToAction)
