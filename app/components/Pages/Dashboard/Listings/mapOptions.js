import config from '../../../../../config/public'

export const DECLUSTER_ZOOM_LEVEL = 16

export const bootstrapURLKeys = {
  key: config.google.api_key,
  libraries: ['drawing', 'places', 'geometry'].join(',')
}

export const mapInitialState = {
  zoom: 15,
  center: {
    lat: 32.7767,
    lng: -96.797
  },
  size: null,
  bounds: null
}

export const queryOptions = {
  limit: '250',
  open_house: false,
  property_types: ['Residential'],
  listing_statuses: ['Active'],
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
    'RES-Farm/Ranch',
    'RES-Condo',
    'RES-Townhouse'
  ]
}

export const mapOptions = {
  minZoom: 3,
  maxZoom: 25,
  zoomControl: true,
  disableDefaultUI: true
  // draggable: true,
  // mapTypeControl: false,
  // scaleControl: boolean,
  // rotateControl: boolean,
  // fullscreenControl: false,
  // streetViewControl: boolean
}

export default {
  mapOptions,
  queryOptions,
  mapInitialState,
  DECLUSTER_ZOOM_LEVEL
}
