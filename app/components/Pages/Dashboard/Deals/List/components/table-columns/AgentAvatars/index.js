import React from 'react'

import { Tooltip } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

const AgentAvatars = ({ agent }) => {
  if (!agent) {
    return null
  }

  return (
    <Tooltip placement="bottom" title={agent.legal_full_name || ''}>
      <Avatar alt={agent.legal_full_name} user={agent.user} />
    </Tooltip>
  )
}

export default AgentAvatars
