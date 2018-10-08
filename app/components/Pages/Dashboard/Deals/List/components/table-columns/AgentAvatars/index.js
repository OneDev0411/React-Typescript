import React from 'react'
import styled from 'styled-components'

import Tooltip from '../../../../../../../../views/components/tooltip'
import Avatar from '../../../../../../../../views/components/Avatar'
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
      <Avatar image={image} size={32} title={agent.legal_full_name} />
    </Tooltip>
  )
}

export default AgentAvatars
