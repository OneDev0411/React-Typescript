import React from 'react'

import PropTypes from 'prop-types'
import S from 'shorti'

const AgentImage = ({ listing, defaultAvatar }) => {
  const { proposed_agent } = listing

  if (!proposed_agent) {
    return <div />
  }

  let is_mobile

  // Responsive
  if (typeof window !== 'undefined' && window.innerWidth < 500) {
    is_mobile = true
  }

  let avatar
  const { profile_image_url } = proposed_agent

  if (profile_image_url) {
    avatar = (
      <div
        style={S(
          `bg-url(${profile_image_url}) w-50 h-50 bg-center bg-cover br-100`
        )}
      />
    )
  } else {
    avatar = (
      <div
        style={S(
          `bg-url(${defaultAvatar}) w-50 h-50 bg-center bg-cover br-100`
        )}
      />
    )
  }

  let bg_color = 'dddfe0'

  if (proposed_agent.agent && proposed_agent.agent.online_state) {
    if (
      (proposed_agent.agent &&
        proposed_agent.agent.online_state === 'Online') ||
      proposed_agent.agent.online_state === 'Background'
    ) {
      bg_color = '35b863'
    }
  }

  return (
    <div
      style={S(
        `p-0 br-100 border-2-solid-fff absolute r-20 b-${
          is_mobile ? '103' : '80'
        } bg-ccc`
      )}
    >
      <div
        style={S(
          `br-100 bg-${bg_color} w-13 h-13 bw-2 solid bc-fff absolute z-2 t-2n r-2`
        )}
      />
      {avatar}
    </div>
  )
}

AgentImage.propTypes = {
  listing: PropTypes.object.isRequired
}

export default AgentImage
