import { TemplateVariable } from './types'

export const LISTING_TEMPLATE_TYPES = [
  'OpenHouse',
  'JustSold',
  'ComingSoon',
  'JustListed',
  'PriceImprovement',
  'AsSeenIn'
]

export const TEMPLATES_PAGE_SIZE = 8

export const TEMPLATE_VARIABLES = [
  {
    section: 'Listing Info',
    name: 'listing.price',
    label: 'Price',
    type: 'number'
  } as TemplateVariable<'number'>,
  {
    section: 'Listing Info',
    name: 'listing.property.address.city',
    label: 'City',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Listing Info',
    name: 'listing.property.address.full_address',
    label: 'Full Address',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Listing Info',
    name: 'listing.property.address.postal_code',
    label: 'Postal Code',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Listing Info',
    name: 'listing.property.address.state',
    label: 'State',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Listing Info',
    name: 'listing.property.address.street_address',
    label: 'Street Address',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Listing Info',
    name: 'listing.property.address.street_name',
    label: 'Street Name',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Listing Info',
    name: 'listing.property.address.street_number',
    label: 'Street Number',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Listing Info',
    name: 'listing.property.bedroom_count',
    label: 'Bedrooms',
    type: 'number'
  } as TemplateVariable<'number'>,
  {
    section: 'Listing Info',
    name: 'listing.property.description',
    label: 'Description',
    type: 'text'
  } as TemplateVariable<'text'>,
  {
    section: 'Listing Info',
    name: 'listing.property.full_bathroom_count',
    label: 'Full Bathrooms',
    type: 'number'
  } as TemplateVariable<'number'>,
  {
    section: 'Listing Info',
    name: 'listing.property.half_bathroom_count',
    label: 'Half Bathrooms',
    type: 'number'
  } as TemplateVariable<'number'>,
  {
    section: 'Listing Info',
    name: 'listing.property.square_meters',
    label: 'Area',
    type: 'number'
  } as TemplateVariable<'number'>,
  {
    section: 'Agent Info',
    name: 'user.profile_image_url',
    label: 'Agent Photo',
    type: 'image'
  } as TemplateVariable<'image'>,
  {
    section: 'Agent Info',
    name: 'user.display_name',
    label: 'Agent Name',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Agent Info',
    name: 'user.email',
    label: 'Agent Email',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Agent Info',
    name: 'user.phone_number',
    label: 'Agent Phone',
    type: 'string'
  } as TemplateVariable<'string'>,
  {
    section: 'Photos',
    name: 'listing.gallery_image_urls',
    label: 'Listing Photos',
    sortableName: 'listingPhotos',
    type: 'sortableImageList',
    images: [
      {
        name: 'listing.gallery_image_urls.0',
        label: 'Listing Photo',
        order: 1,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>,
      {
        name: 'listing.gallery_image_urls.1',
        label: 'Listing Photo 2',
        order: 1,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>,
      {
        name: 'listing.gallery_image_urls.2',
        label: 'Listing Photo 3',
        order: 2,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>,
      {
        name: 'listing.gallery_image_urls.3',
        label: 'Listing Photo 4',
        order: 3,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>,
      {
        name: 'listing.gallery_image_urls.4',
        label: 'Listing Photo 5',
        order: 4,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>,
      {
        name: 'listing.gallery_image_urls.5',
        label: 'Listing Photo 6',
        order: 5,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>,
      {
        name: 'listing.gallery_image_urls.6',
        label: 'Listing Photo 7',
        order: 6,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>,
      {
        name: 'listing.gallery_image_urls.7',
        label: 'Listing Photo 8',
        order: 7,
        type: 'sortableImageItem'
      } as TemplateVariable<'sortableImageItem'>
    ]
  } as TemplateVariable<'sortableImageList'>
]
