interface AgentInfo {
  name?: string
  email?: string
  image?: string | null
  tel?: string
  company?: string
}

export function getAgentInfo(listing: IListing<'proposed_agent'>): AgentInfo {
  const listAgent = listing.list_agent

  if (listAgent) {
    return {
      name: listAgent.full_name,
      email: listAgent.email,
      image: listAgent.profile_image_url,
      tel: listAgent.phone_number
    }
  }

  return {
    name: listing.list_agent_full_name,
    email: listing.list_agent_email,
    tel: listing.list_agent_direct_work_phone,
    company: listing.list_office_name
  }
}
