import React from 'react'

import { Avatar } from 'components/GeneralAvatar'

import Tooltip from 'components/tooltip'

const AgentAvatars = ({ agent }) => {
  if (!agent) {
    return null
  }

  return (
    <Tooltip placement="bottom" caption={agent.legal_full_name}>
      <Avatar alt={agent.legal_full_name} user={agent.user} />
    </Tooltip>
  )
}

export default AgentAvatars
