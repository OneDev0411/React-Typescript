import { useState, useEffect } from 'react'

import { Box, Divider, Grid, Typography } from '@material-ui/core'
import { useLoadScript, LoadScriptProps } from '@react-google-maps/api'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import getAgents, { AgentWithStats } from '@app/models/agent-network/get-agents'
import ListingAlertFilters from 'components/ListingAlertFilters'
import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import config from 'config'
import { useLoadingEntities } from 'hooks/use-loading'
import getListing from 'models/listings/listing/get-listing'
import { selectUser } from 'selectors/user'

import { openSearchResultPage } from '../helpers'
import Layout from '../Layout'

import AgentsGrid from './Grid'
import { getListingVAlertFilters, getLocationVAlertFilters } from './helpers'
import { ListingWithProposedAgent } from './types'

const GOOGLE_MAPS_LIBRARIES: LoadScriptProps['libraries'] = ['geometry']

function Agents(props: WithRouterProps) {
  const user = useSelector(selectUser)
  const { isLoaded: isGoogleMapsLoaded } = useLoadScript({
    googleMapsApiKey: config.google.api_key,
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const [listing, setListing] =
    useState<Nullable<ListingWithProposedAgent>>(null)
  const [agents, setAgents] = useState<Nullable<AgentWithStats[]>>(null)
  const [isLoadingAgents, setIsLoadingAgents] = useLoadingEntities(agents)

  const [filters, setFilters] =
    useState<Nullable<AlertFiltersWithRadiusAndCenter>>(null)

  useEffect(() => {
    async function fetchListingBasedData() {
      if (!isGoogleMapsLoaded) {
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
  }, [isGoogleMapsLoaded, props.location.query.listing])

  useEffect(() => {
    async function fetchLocationBasedData() {
      if (!isGoogleMapsLoaded) {
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

      const mockedListing =
        (await getMockListing()) as unknown as ListingWithProposedAgent

      setListing(mockedListing)
    }

    fetchLocationBasedData()
  }, [isGoogleMapsLoaded, props.location.query.lat, props.location.query.lng])

  useEffect(() => {
    async function fetchAgents() {
      if (!filters) {
        return
      }

      try {
        setAgents(null)

        const fetchedAgents = await getAgents(filters)

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

  if (!isGoogleMapsLoaded) {
    return null
  }

  return (
    <Layout
      noGlobalActionsButton
      title="Select Agents"
      onSelectSearchResult={openSearchResultPage}
    >
      <Grid container direction="column">
        <Grid
          container
          item
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Grid item>
            {props.location.query.title && (
              <Typography variant="body1">
                {props.location.query.title}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {filters && (
              <ListingAlertFilters
                filters={filters}
                onApply={handleApplyFilters}
              />
            )}
          </Grid>
        </Grid>
        <Grid item>
          <Box py={1}>
            <Divider />
          </Box>
        </Grid>
        <Grid item>
          <AgentsGrid
            user={user}
            filters={filters}
            listing={listing}
            agents={agents}
            isLoading={isLoadingAgents}
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default withRouter(Agents)
