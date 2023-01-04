import { useState, useEffect } from 'react'

import { Box, Divider, Grid, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useLoadScript, LoadScriptProps } from '@react-google-maps/api'
import { useSelector } from 'react-redux'

import { useNavigate } from '@app/hooks/use-navigate'
import getAgents, { AgentWithStats } from '@app/models/agent-network/get-agents'
import { WithRouterProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import ListingAlertFilters from 'components/ListingAlertFilters'
import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import config from 'config'
import { useLoadingEntities } from 'hooks/use-loading'
import getListing from 'models/listings/listing/get-listing'
import { selectUser } from 'selectors/user'

import { toSearchResultPage } from '../helpers'
import Layout from '../Layout'

import AgentsGrid from './Grid'
import { getListingVAlertFilters, getLocationVAlertFilters } from './helpers'
import { ListingWithProposedAgentAndMlsInfo } from './types'

export interface ZipcodeOption {
  id: string
  title: string
}

const DISABLED_MLS_LIST: string[] = []
const GOOGLE_MAPS_LIBRARIES: LoadScriptProps['libraries'] = ['geometry']

function Agents(props: WithRouterProps) {
  const user = useSelector(selectUser)
  const { isLoaded: isGoogleMapsLoaded } = useLoadScript({
    googleMapsApiKey: config.google.api_key,
    libraries: GOOGLE_MAPS_LIBRARIES
  })
  const navigate = useNavigate()

  const [listing, setListing] =
    useState<Nullable<ListingWithProposedAgentAndMlsInfo>>(null)
  const [agents, setAgents] = useState<Nullable<AgentWithStats[]>>(null)
  const [isLoadingAgents, setIsLoadingAgents] = useLoadingEntities(agents)

  const [filters, setFilters] =
    useState<Nullable<AlertFiltersWithRadiusAndCenter>>(null)

  useEffect(() => {
    async function fetchListingBasedData() {
      if (!isGoogleMapsLoaded) {
        return
      }

      const listingId: Optional<string | null> =
        props.searchParams.get('listing')

      if (!listingId) {
        setListing(null)

        return
      }

      try {
        const fetchedListing: ListingWithProposedAgentAndMlsInfo =
          await getListing(listingId)

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
  }, [isGoogleMapsLoaded, props.searchParams])

  useEffect(() => {
    async function fetchLocationBasedData() {
      if (!isGoogleMapsLoaded) {
        return
      }

      const lat: Optional<string | null> = props.searchParams.get('lat')
      const lng: Optional<string | null> = props.searchParams.get('lng')

      if (!lat || !lng) {
        return
      }

      const placeBasedFilters = getLocationVAlertFilters({
        lat: Number(lat),
        lng: Number(lng)
      })

      setFilters(placeBasedFilters)

      const mockedListing =
        (await getMockListing()) as unknown as ListingWithProposedAgentAndMlsInfo

      setListing(mockedListing)
    }

    fetchLocationBasedData()
  }, [isGoogleMapsLoaded, props.searchParams])

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

  const OpenSearchResultPage = () => {
    console.log('test 2', toSearchResultPage)

    navigate('/dashboard/agent-network/agents', { state: toSearchResultPage })
  }

  return (
    <Layout
      noGlobalActionsButton
      title="Select Agents"
      onSelectSearchResult={OpenSearchResultPage}
    >
      {listing && DISABLED_MLS_LIST.includes(listing.mls) ? (
        <Alert severity="info">
          <p>
            Unfortunately Agent Network is now disabled on <b>NTREIS</b> due to
            their policies and guidelines. We at Rechat are trying to find how
            to provide the functionality back for you.
          </p>
          <p>
            As of right now we don't have a clear timeline, but are hoping it
            would be a matter of weeks before we have AN activated for North
            Texas again.
          </p>
        </Alert>
      ) : (
        <Grid container direction="column">
          <Grid
            container
            item
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <Grid item>
              {props.searchParams.get('title') && (
                <Typography variant="body1">
                  {props.searchParams.get('title')}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {filters && (
                <>
                  {listing?.mls_info !== undefined ? (
                    <ListingAlertFilters
                      filters={filters}
                      onApply={handleApplyFilters}
                      isStatic={
                        listing?.mls_info?.enable_agent_network !== true
                      }
                    />
                  ) : (
                    <ListingAlertFilters
                      filters={filters}
                      onApply={handleApplyFilters}
                      isStatic={false}
                    />
                  )}
                </>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <Box py={1}>
              <Divider />
            </Box>
          </Grid>
          <Grid item>
            {listing?.mls_info !== undefined ? (
              <AgentsGrid
                user={user}
                filters={filters}
                listing={listing}
                agents={agents}
                isLoading={isLoadingAgents}
                isStatic={listing?.mls_info?.enable_agent_network !== true}
              />
            ) : (
              <AgentsGrid
                user={user}
                filters={filters}
                listing={listing}
                agents={agents}
                isLoading={isLoadingAgents}
                isStatic={false}
              />
            )}
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export default withRouter(Agents)
