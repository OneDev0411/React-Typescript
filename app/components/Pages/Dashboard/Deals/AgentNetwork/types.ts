export interface IDealAgent {
  id: UUID
  agent: IAgent
  agentId: UUID
  name: string
  email: string
  phone: string
  company: string
  asBuyers: any[]
  asListing: any[]
  listings: any[]
  listingsAveragePrice: number
  listingsCount: number
  listingsTotalVolume: number
  soldListings: any[]
}
