export type ListingWithProposedAgent = IListing<'proposed_agent'>

export type CompactListingWithBothSideAgents = ICompactListing<
  'list_agent' | 'selling_agent'
>

export type AgentSide = 'selling-agent' | 'list-agent'

export interface AggregatedAgentInfo {
  id: UUID // We actually need it for grid selection
  agent: IAgent
  officeName: string | null
  listingsAsSellingAgent: CompactListingWithBothSideAgents[]
  listingsAsListAgent: CompactListingWithBothSideAgents[]
  stats: {
    totalVolume: number
    averagePrice: number
  }
}
