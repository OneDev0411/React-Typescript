import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'
import { LoadScript } from '@react-google-maps/api'

import config from 'config'
import { IAppState } from 'reducers'
import { useLoadingEntities } from 'hooks/use-loading'
import getListing from 'models/listings/listing/get-listing'

import Layout from '../Layout'
import { ListingWithProposedAgent, AggregatedAgentInfo } from './types'
import {
  aggregateListingsAgents,
  getListingsWithBothSidesAgents,
  getVAlertFilters
} from './helpers'
import AgentsGrid from './Grid'

const GOOGLE_MAPS_LIBRARIES = ['geometry']

function Agents(props: WithRouterProps) {
  const user = useSelector<IAppState, IUser>(state => state.user)
  const [isLoadingGoogleMaps, setIsLoadingGoogleMaps] = useState<boolean>(true)

  const [listing, setListing] = useState<Nullable<ListingWithProposedAgent>>(
    null
  )
  const [agents, setAgents] = useState<Nullable<AggregatedAgentInfo[]>>(null)
  const [isLoadingAgents, setIsLoadingAgents] = useLoadingEntities(agents)

  const [filters, setFilters] = useState<Nullable<AlertFilters>>(null)

  useEffect(() => {
    async function fetchData() {
      if (isLoadingGoogleMaps) {
        return
      }

      const listingId: Optional<string> = props.location.query.listing

      if (!listingId) {
        setListing(null)

        return
      }

      try {
        // Fetch listing
        const fetchedListing: ListingWithProposedAgent = await getListing(
          listingId
        )

        setListing(fetchedListing)

        // Fetch filters
        const listingBasedFilters = await getVAlertFilters(fetchedListing)

        setFilters(listingBasedFilters)

        // Fetch agents
        const listingsWithBothAgents = await getListingsWithBothSidesAgents(
          listingBasedFilters
        )

        const fetchedAgents = aggregateListingsAgents(listingsWithBothAgents)

        setAgents(fetchedAgents)
      } catch (error) {
        console.error('Error fetching data', error)
        setIsLoadingAgents(false)
      }
    }

    fetchData()
  }, [isLoadingGoogleMaps, props.location.query.listing, setIsLoadingAgents])

  console.log({ filters })

  return (
    <LoadScript
      googleMapsApiKey={config.google.api_key}
      libraries={GOOGLE_MAPS_LIBRARIES}
      onLoad={() => setIsLoadingGoogleMaps(false)}
    >
      <Layout title={listing?.property.address.full_address}>
        <AgentsGrid
          user={user}
          listing={listing}
          agents={agents}
          isLoading={isLoadingAgents}
        />
      </Layout>
    </LoadScript>
  )
}

export default withRouter(Agents)
