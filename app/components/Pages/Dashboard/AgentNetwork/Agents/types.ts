export type ListingWithProposedAgent = IListing<'proposed_agent'>

export type CompactListingWitgBothSideAgents = ICompactListing<
  'list_agent' | 'selling_agent'
>

export type AgentSide = 'selling-agent' | 'list-agent'

export interface AggregatedAgentInfo {
  id: UUID // We actually need it for grid selection
  agent: IAgent
  listingsAsSellingAgent: CompactListingWitgBothSideAgents[]
  listingsAsListAgent: CompactListingWitgBothSideAgents[]
  stats: {
    totalVolume: number
    averagePrice: number
  }
}
