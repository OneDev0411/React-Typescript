import { byValert } from 'models/listings/search/get-listings'
import { getPlace } from 'models/listings/search/get-place'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

import {
  DEFAULT_SEARCH_RADIUS,
  DEFAULT_SEARCH_RESULT_LIMIT,
  ALL_PROPERTY_TYPES,
  ALL_PROPERTY_SUBTYPES
} from '../constants'
import { AggregatedAgentInfo, CompactListingWithBothSideAgents } from './types'

function getSixMonthsAgoTimestamp() {
  return (new Date().getTime() - 180 * 24 * 3600000) / 1000
}

export async function getListingVAlertFilters(
  listing: IListing
): Promise<AlertFiltersWithRadiusAndCenter> {
  const sixMonthsAgoTimestamp = getSixMonthsAgoTimestamp()
  const place = await getPlace(listing.property.address.full_address)

  return {
    property_types: [listing.property.property_type],
    property_subtypes: [listing.property.property_subtype],
    minimum_bedrooms: listing.property.bedroom_count,
    maximum_bedrooms: listing.property.bedroom_count,
    minimum_bathrooms: listing.property.full_bathroom_count,
    maximum_bathrooms: listing.property.full_bathroom_count,
    minimum_sold_date: sixMonthsAgoTimestamp,
    points: getMapBoundsInCircle(place.center, DEFAULT_SEARCH_RADIUS),
    radius: DEFAULT_SEARCH_RADIUS,
    center: { latitude: place.center.lat, longitude: place.center.lng },
    limit: DEFAULT_SEARCH_RESULT_LIMIT
  }
}

export function getLocationVAlertFilters(
  location: google.maps.LatLngLiteral
): AlertFiltersWithRadiusAndCenter {
  const sixMonthsAgoTimestamp = getSixMonthsAgoTimestamp()

  return {
    property_types: ALL_PROPERTY_TYPES,
    property_subtypes: ALL_PROPERTY_SUBTYPES,
    points: getMapBoundsInCircle(location, DEFAULT_SEARCH_RADIUS),
    center: {
      latitude: location.lat,
      longitude: location.lng
    },
    radius: DEFAULT_SEARCH_RADIUS,
    minimum_sold_date: sixMonthsAgoTimestamp,
    limit: DEFAULT_SEARCH_RESULT_LIMIT
  }
}

export async function getListingsWithBothSidesAgents(
  filters: AlertFilters
): Promise<CompactListingWithBothSideAgents[]> {
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
  listings: CompactListingWithBothSideAgents[]
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
