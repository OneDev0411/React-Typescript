import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'
import { LoadScript } from '@react-google-maps/api'
import { Box, Divider, Grid } from '@material-ui/core'

import config from 'config'
import { IAppState } from 'reducers'
import { useLoadingEntities } from 'hooks/use-loading'
import getListing from 'models/listings/listing/get-listing'

import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import ListingAlertFilters from 'components/ListingAlertFilters'

import Layout from '../Layout'
import { ListingWithProposedAgent, AggregatedAgentInfo } from './types'
import {
  aggregateListingsAgents,
  getListingsWithBothSidesAgents,
  getListingVAlertFilters,
  getLocationVAlertFilters
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

  const [filters, setFilters] = useState<
    Nullable<AlertFiltersWithRadiusAndCenter>
  >(null)

  useEffect(() => {
    async function fetchListingBasedData() {
      if (isLoadingGoogleMaps) {
        return
      }

      const listingId: Optional<string> = props.location.query.listing

      if (!listingId) {
        setListing(null)

        return
      }

      try {
        const fetchedListing: ListingWithProposedAgent = await getListing(
          listingId
        )

        setListing(fetchedListing)

        const listingBasedFilters = await getListingVAlertFilters(
          fetchedListing
        )

        setFilters(listingBasedFilters)
      } catch (error) {
        console.error('Error fetching listing/listing filters', error)
      }
    }

    fetchListingBasedData()
  }, [isLoadingGoogleMaps, props.location.query.listing])

  useEffect(() => {
    async function fetchLocationBasedData() {
      if (isLoadingGoogleMaps) {
        return
      }

      const lat: Optional<string> = props.location.query.lat
      const lng: Optional<string> = props.location.query.lng

      if (!lat || !lng) {
        return
      }

      const placeBasedFilters = getLocationVAlertFilters({
        lat: Number(lat),
        lng: Number(lng)
      })

      setFilters(placeBasedFilters)

      const mockedListing = ((await getMockListing()) as unknown) as ListingWithProposedAgent

      setListing(mockedListing)
    }

    fetchLocationBasedData()
  }, [isLoadingGoogleMaps, props.location.query.lat, props.location.query.lng])

  useEffect(() => {
    async function fetchAgents() {
      if (!filters) {
        return
      }

      try {
        setAgents(null)

        const listingsWithBothAgents = await getListingsWithBothSidesAgents(
          filters
        )

        const fetchedAgents = aggregateListingsAgents(listingsWithBothAgents)

        setAgents(fetchedAgents)
      } catch (error) {
        console.error('Error fetching agents', error)
        setIsLoadingAgents(false)
      }
    }

    fetchAgents()
  }, [filters, setIsLoadingAgents])

  function handleApplyFilters(newFilters: AlertFiltersWithRadiusAndCenter) {
    setFilters(newFilters)
  }

  return (
    <LoadScript
      googleMapsApiKey={config.google.api_key}
      libraries={GOOGLE_MAPS_LIBRARIES}
      onLoad={() => setIsLoadingGoogleMaps(false)}
    >
      <Layout title="Select Agents">
        <Grid container direction="column">
          <Grid container item justify="flex-end">
            {filters && (
              <ListingAlertFilters
                filters={filters}
                onApply={handleApplyFilters}
              />
            )}
          </Grid>
          <Grid item>
            <Box py={1}>
              <Divider />
            </Box>
          </Grid>
          <Grid item>
            <AgentsGrid
              user={user}
              listing={listing}
              agents={agents}
              isLoading={isLoadingAgents}
            />
          </Grid>
        </Grid>
      </Layout>
    </LoadScript>
  )
}

export default withRouter(Agents)
