interface AgentInfo {
  name?: string
  email?: string
  image?: string | null
  tel?: string
}

export function getAgentInfo(
  listing: IListing<'proposed_agent'>
): AgentInfo | null {
  const proposedAgent = listing.proposed_agent

  if (proposedAgent) {
    return {
      email: proposedAgent.email,
      tel: proposedAgent.phone_number,
      image: proposedAgent.profile_image_url,
      name: `${proposedAgent.first_name} ${proposedAgent.last_name}`.trim()
    }
  }

  return null
}
