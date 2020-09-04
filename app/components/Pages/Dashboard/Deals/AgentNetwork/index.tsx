import React, { useState, useRef } from 'react'
import Flex from 'styled-flex-component'
import { useEffectOnce } from 'react-use'
import { useSelector } from 'react-redux'
import { useTheme } from '@material-ui/styles'
import { WithRouterProps } from 'react-router'
import { Theme, Typography } from '@material-ui/core'

import { getMapBoundsInCircle } from 'utils/get-coordinates-points'
import { getAddress } from 'models/Deal/helpers/context'
import { byValert } from 'models/listings/search/get-listings'
import getPlace from 'models/listings/search/get-place'
import getListing from 'models/listings/listing/get-listing'

import { IAppState } from 'reducers'
import { selectDealById } from 'reducers/deals/list'

import { loadJS } from 'utils/load-js'
import config from 'config'

import { GridContextProvider } from 'components/Grid/Table/context/provider'
import GlobalHeader from 'components/GlobalHeader'
import { CloseButton } from 'components/Button/CloseButton'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { DEFAULT_RADIUS_FILTER } from './constants'
import { valertOptions } from './helpers/valert-options'
import { normalizeList } from './helpers/normalize-list'
import { filterNonMLSAgents } from './helpers/filter-non-mls-agents'
import { Grid } from './Grid'
import { AreaFilter } from './Filters/AreaFilter'
import { Filter } from './Filters/types'
import { IDealAgent } from './types'

interface Place {
  zoom: number
  center: string
}

interface Props {
  location: WithRouterProps['location']
  params: WithRouterProps['params']
}

export default function AgentNetwork({ location, params }: Props) {
  const [isFetching, setIsFetching] = useState(true)

  const [address, setAddress] = useState(location.query.address || '')
  const [place, setPlace] = useState<Place | null>(null)
  const [listing, setListing] = useState<IListing | null>(null)
  const [list, setList] = useState<IDealAgent[]>([])
  const previousFilter = useRef<Filter>(DEFAULT_RADIUS_FILTER)
  const rawList = useRef<StringMap<ICompactListing[]>>({})

  const theme = useTheme<Theme>()

  const { user, deal } = useSelector<
    IAppState,
    {
      user: IUser
      deal: IDeal
    }
  >(({ user, deals }) => ({
    user,
    deal: selectDealById(deals.list, params.id)
  }))

  useEffectOnce(() => {
    ;(window as any).initializeAgentNetworkList = initialize

    loadJS(
      `https://maps.googleapis.com/maps/api/js?key=${config.google.api_key}&libraries=geometry&callback=initializeAgentNetworkList`
    )
  })

  const initialize = async () => {
    const filter = DEFAULT_RADIUS_FILTER

    let query = null
    let place = null
    let listing = null

    try {
      if (deal) {
        const address = getAddress(deal)

        place = await getPlace(address)

        if (location) {
          if (deal.listing) {
            listing = await getListing(deal.listing)
          }

          setAddress(address)
          setListing(listing)
          setPlace(place)

          query = getQuery(listing, place, filter)
        }
      } else if (address) {
        place = await getPlace(address)
        setPlace(place)

        query = getQuery(listing, place, filter)
      }

      const data = await fetchAgents(query)

      setList(normalizeList(data))
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  const fetchAgents = async query => {
    if (!query) {
      return
    }

    try {
      setIsFetching(true)

      const response = await byValert(
        query,
        null,
        false,
        '?associations[]=compact_listing.selling_agent&associations[]=compact_listing.list_agent'
      )

      return response.data
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetching(false)
    }
  }

  const getQuery = (
    listing: IListing | null,
    place: Place | null,
    filter: Filter
  ) => {
    let query

    const getSearchArea = () => {
      if (filter.type === 'radius' && place) {
        return {
          points: getMapBoundsInCircle(place.center, filter.radius)
        }
      }

      if (filter.type === 'custom') {
        return {
          points: null,
          mls_areas: filter.areas
        }
      }
    }

    if (listing) {
      const { property } = listing

      query = {
        ...valertOptions,
        ...getSearchArea(),
        architectural_style: property.architectural_style,
        minimum_bedrooms: property.bedroom_count,
        maximum_bedrooms: property.bedroom_count,
        minimum_bathrooms: property.full_bathroom_count,
        maximum_bathrooms: property.full_bathroom_count,
        property_subtype: [property.property_subtype],
        property_type: [property.property_type]
      }
    } else if (location) {
      query = {
        ...valertOptions,
        ...getSearchArea()
      }
    }

    return query
  }

  const onSetFilter = async (filter: Filter) => {
    let newList: any[] = []
    const RADIUS_FILTER_TYPE = 'radius'

    if (filter.type === RADIUS_FILTER_TYPE) {
      const data = await fetchAgents(getQuery(listing, place, filter))

      rawList.current = {}
      newList = normalizeList(data)
    } else {
      const getAreasInString = (areas: number[][]): string =>
        areas.map(area => area.join('-')).join()

      const currentAreas = getAreasInString(previousFilter.current.areas || [])

      const nextAreas = getAreasInString(filter.areas || [])

      const addedAreas = (filter.areas || []).filter(
        area => !currentAreas.includes(area.join('-'))
      )

      const removedAreas = getAreasInString(
        (previousFilter.current.areas || []).filter(
          area => !nextAreas.includes(area.join('-'))
        )
      )

      let newRawList: StringMap<ICompactListing[]> = {}

      Object.keys(rawList.current).forEach(area => {
        const areaKey = area.replace(',', '-')

        if (removedAreas.includes(areaKey)) {
          return false
        }

        newRawList[area] = rawList.current[area]
      })

      if (addedAreas.length > 0) {
        const requests: Promise<ICompactListing[]>[] = addedAreas.map(area =>
          fetchAgents(getQuery(listing, place, { ...filter, areas: [area] }))
        )

        const response = await Promise.all(requests)

        response.forEach((data, index) => {
          newRawList[addedAreas[index].join()] = data
        })
      }

      rawList.current = newRawList

      newList = normalizeList(Object.values(newRawList).flat())
    }

    previousFilter.current = filter
    setList(newList)
  }

  return (
    <div style={{ margin: theme.spacing(5) }}>
      <GlobalHeader noGlobalActionsButton noPadding>
        <Flex
          column
          style={{
            flexGrow: 1
          }}
        >
          <Typography variant="h4">Agent Network</Typography>
          <Typography
            variant="body1"
            style={{
              color: theme.palette.grey[600]
            }}
          >
            {address}
          </Typography>
        </Flex>

        <div>
          <CloseButton
            backUrl={`/dashboard/deals/${deal.id}`}
            buttonProps={{
              size: 'medium'
            }}
            iconProps={{
              size: muiIconSizes.large
            }}
          />
        </div>
      </GlobalHeader>

      <GridContextProvider>
        <AreaFilter disabled={isFetching} handleSearch={onSetFilter} />

        <Grid
          user={user}
          data={list.filter(filterNonMLSAgents)}
          deal={deal}
          isFetching={isFetching}
        />
      </GridContextProvider>
    </div>
  )
}
