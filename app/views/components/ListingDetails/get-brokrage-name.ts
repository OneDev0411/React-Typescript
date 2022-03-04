export const sortAgentListToFindBrokerage = (
  agentsList: ListingAgent[],
  mls: string
) => {
  const statusOrders = ['Active', null, 'Inactive']

  return (
    [...agentsList]
      .sort((a, b) => {
        // move same mls to the top
        if (a.mls === mls || b.mls !== mls) {
          return -1
        }

        if (a.mls !== mls || b.mls === mls) {
          return 1
        }

        return 0
      })
      // move null and inactive statuses to the bottom
      .sort((a, b) => {
        return statusOrders.indexOf(a.status) - statusOrders.indexOf(b.status)
      })
  )
}

// TODO: It's a complicated way to get brokrage name from a listing.
// We have to do this way because of some product issues and API limitations.
// We should looking for a better way to get brokrage name from a listing.
export const getBrokrageName = (
  listing: IListing<'proposed_agent'>
): string | undefined => {
  const proposedAgentsList = listing.proposed_agent.agents
  const mls = listing.mls

  if (proposedAgentsList && proposedAgentsList.length) {
    // Sort agents array by listing's MLS name
    const sortedAgentsList = sortAgentListToFindBrokerage(
      proposedAgentsList,
      mls
    )

    // Return office name of first agent (hopefully it's the same as listing's MLS name)
    return sortedAgentsList[0].office?.name
  }

  return undefined
}
