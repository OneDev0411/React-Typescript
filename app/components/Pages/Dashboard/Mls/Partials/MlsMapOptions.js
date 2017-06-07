import config from '../../../../../../config/public'

export const bootstrapURLKeys = {
  key: config.google.api_key,
  libraries: ['drawing', 'places'].join(',')
}

export const mapInitialState = {
  zoom: 15,
  center: {
    lat: 32.7767,
    lng: -96.7970
  },
  size: null,
  bounds: null
}

export const queryOptions = {
  limit: '250',
  location: {
    longitude: -96.79698789999998,
    latitude: 32.7766642
  },
  horizontal_distance: 2830,
  property_types: ['Residential'],
  vertical_distance: 2830,
  listing_statuses: [
    'Active',
    'Active Contingent',
    'Active Kick Out',
    'Active Option Contract'
  ],
  currency: 'USD',
  maximum_year_built: 2015,
  points: [
    {
      latitude: 32.83938955111425,
      longitude: -96.89115626525879
    },
    {
      latitude: 32.83938955111425,
      longitude: -96.70284373474121
    },
    {
      latitude: 32.71396625328302,
      longitude: -96.70284373474121
    },
    {
      latitude: 32.71396625328302,
      longitude: -96.89115626525879
    },
    {
      latitude: 32.83938955111425,
      longitude: -96.89115626525879
    }
  ],
  open_house: false,
  property_subtypes: [
    'RES-Single Family',
    'RES-Half Duplex',
    'RES-Farm\/Ranch',
    'RES-Condo',
    'RES-Townhouse'
  ]
}

export const mapOptions = {
  minZoom: 3,
  maxZoom: 25,
  mapTypeControl: false,
  draggable: true,
  disableDefaultUI: true
}

export default {
  mapOptions,
  queryOptions,
  mapInitialState
}
