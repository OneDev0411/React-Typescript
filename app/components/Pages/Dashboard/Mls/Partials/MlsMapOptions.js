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
  property_types: ['Residential'],
  listing_statuses: [
    'Active',
    'Active Contingent',
    'Active Kick Out',
    'Active Option Contract'
  ],
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
