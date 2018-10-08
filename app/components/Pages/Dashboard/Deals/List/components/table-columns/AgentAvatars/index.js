import React from 'react'
import styled from 'styled-components'
import Avatar from 'react-avatar'
import Tooltip from '../../../../../../../../views/components/tooltip'
import { grey } from '../../../../../../../../views/utils/colors'

const NoPrimaryAgent = styled.div`
  color: ${grey.A550};
`

const AgentAvatars = ({ agent }) => {
  if (!agent) {
    return null
  }

  const image = agent.user && agent.user.profile_image_url

  return (
    <Tooltip placement="bottom" caption={agent.legal_full_name}>
      <Avatar
        className="avatar"
        color="#000000"
        round
        name={agent.legal_full_name}
        src={image}
        size={32}
      />
    </Tooltip>
  )
}

export default AgentAvatars
