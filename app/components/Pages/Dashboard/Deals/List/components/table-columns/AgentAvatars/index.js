import React from 'react'

import Avatar from 'components/Avatar'

import Tooltip from 'components/tooltip'

const AgentAvatars = ({ agent }) => {
  if (!agent) {
    return null
  }

  return (
    <Tooltip placement="bottom" caption={agent.legal_full_name}>
      <Avatar
        title={agent.legal_full_name}
        image={agent.user && agent.user.profile_image_url}
        size={32}
      />
    </Tooltip>
  )
}

export default AgentAvatars
