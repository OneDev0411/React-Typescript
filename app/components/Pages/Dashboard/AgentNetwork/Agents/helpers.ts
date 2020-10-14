import { byValert } from 'models/listings/search/get-listings'
import { getPlace } from 'models/listings/search/get-place'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

import { DEFAULT_SEARCH_RADIUS } from '../constants'
import { AggregatedAgentInfo, CompactListingWitgBothSideAgents } from './types'

export async function getVAlertFilters(
  listing: IListing
): Promise<AlertFilters> {
  const sixMonthsAgoTimestamp =
    (new Date().getTime() - 180 * 24 * 3600000) / 1000

  const place = await getPlace(listing.property.address.full_address)

  return {
    property_types: [listing.property.property_type],
    property_subtypes: [listing.property.property_subtype],
    minimum_bedrooms: listing.property.bedroom_count,
    maximum_bedrooms: listing.property.bedroom_count,
    minimum_bathrooms: listing.property.full_bathroom_count,
    maximum_bathrooms: listing.property.full_bathroom_count,
    minimum_sold_date: sixMonthsAgoTimestamp,
    points: place
      ? getMapBoundsInCircle(place.center, DEFAULT_SEARCH_RADIUS)
      : null,
    limit: 100
  }
}

export async function getListingsWithBothSidesAgents(
  filters: AlertFilters
): Promise<CompactListingWitgBothSideAgents[]> {
  const response = await byValert(
    filters,
    {
      'associations[]': [
        'compact_listing.selling_agent',
        'compact_listing.list_agent'
      ]
    },
    false
  )

  return response.data
}

export function aggregateListingsAgents(
  listings: CompactListingWitgBothSideAgents[]
): AggregatedAgentInfo[] {
  const agentsMap: StringMap<AggregatedAgentInfo> = {}

  listings.forEach(listing => {
    if (listing.selling_agent) {
      let agentInfo: Nullable<AggregatedAgentInfo> = null

      if (agentsMap[listing.selling_agent.id]) {
        agentInfo = agentsMap[listing.selling_agent.id]
        agentInfo.listingsAsSellingAgent.push(listing)
      } else {
        agentInfo = {
          id: listing.selling_agent.id,
          agent: listing.selling_agent,
          listingsAsSellingAgent: [listing],
          listingsAsListAgent: [],
          stats: {
            totalVolume: 0,
            averagePrice: 0
          }
        }
        agentsMap[agentInfo.agent.id] = agentInfo
      }
    }

    if (listing.list_agent) {
      let agentInfo: Nullable<AggregatedAgentInfo> = null

      if (agentsMap[listing.list_agent.id]) {
        agentInfo = agentsMap[listing.list_agent.id]
        agentInfo.listingsAsSellingAgent.push(listing)
      } else {
        agentInfo = {
          id: listing.list_agent.id,
          agent: listing.list_agent,
          listingsAsSellingAgent: [listing],
          listingsAsListAgent: [],
          stats: {
            totalVolume: 0,
            averagePrice: 0
          }
        }
        agentsMap[agentInfo.agent.id] = agentInfo
      }
    }
  })

  const agentsDataWithStats: AggregatedAgentInfo[] = Object.keys(agentsMap).map(
    id => {
      const data = agentsMap[id]

      const totalVolume =
        data.listingsAsListAgent.reduce<number>(
          (acc, listing) => acc + listing.price,
          0
        ) +
        data.listingsAsSellingAgent.reduce<number>(
          (acc, listing) => acc + listing.price,
          0
        )
      const averagePrice =
        totalVolume > 0
          ? totalVolume /
            (data.listingsAsListAgent.length +
              data.listingsAsSellingAgent.length)
          : 0

      return {
        ...data,
        stats: {
          totalVolume,
          averagePrice
        }
      }
    }
  )

  return agentsDataWithStats
}
