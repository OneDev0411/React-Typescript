import config from '../../../../../config/public'

export const DECLUSTER_ZOOM_LEVEL = 16

export const property_subtypes = {
  condo: 'RES-Condo',
  farm: 'RES-Farm/Ranch',
  duplex: 'RES-Half Duplex',
  townhouse: 'RES-Townhouse',
  single_family: 'RES-Single Family'
}

export const architectural_styles = {
  southwestern: 'Southwestern',
  ranch: 'Ranch',
  spanish: 'Spanish',
  aFrame: 'A-Frame',
  midCentry_modern: 'Mid-Centry Modern',
  prairie: 'Prairie',
  studio_apartment: 'Studio Apartment',
  contemporary: 'Contemporary/Modern',
  split_level: 'Split Level',
  victorian: 'Victorian',
  traditional: 'Traditional',
  mediterranean: 'Mediterranean',
  colonial: 'Colonial',
  oriental: 'Oriental',
  loft: 'Loft',
  french: 'French',
  tudor: 'Tudor'
}

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
  property_subtypes: objectValueToArray(property_subtypes)
}

export const mapOptions = {
  minZoom: 3,
  maxZoom: 25,
  // zoomControl: false,
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

function objectValueToArray(obj = {}) {
  return Object.keys(obj).map(prop => obj[prop])
}
