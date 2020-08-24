import { TemplateVariableSectionWithItems } from './types'

export const LISTING_TEMPLATE_TYPES = [
  'OpenHouse',
  'JustSold',
  'ComingSoon',
  'JustListed',
  'PriceImprovement',
  'AsSeenIn'
]

export const TEMPLATES_PAGE_SIZE = 8

export const TEMPLATE_VARIABLE_SECTIONS: TemplateVariableSectionWithItems[] = [
  {
    label: 'Listing Info',
    items: [
      {
        name: 'listing.price',
        label: 'Price',
        type: 'number'
      },
      {
        name: 'listing.property.address.city',
        label: 'City',
        type: 'string'
      },
      {
        name: 'listing.property.address.full_address',
        label: 'Full Address',
        type: 'string'
      },
      {
        name: 'listing.property.address.postal_code',
        label: 'Postal Code',
        type: 'string'
      },
      {
        name: 'listing.property.address.state',
        label: 'State',
        type: 'string'
      },
      {
        name: 'listing.property.address.street_address',
        label: 'Street Address',
        type: 'string'
      },
      {
        name: 'listing.property.address.street_name',
        label: 'Street Name',
        type: 'string'
      },
      {
        name: 'listing.property.address.street_number',
        label: 'Street Number',
        type: 'string'
      },
      {
        name: 'listing.property.bedroom_count',
        label: 'Bedrooms',
        type: 'number'
      },
      {
        name: 'listing.property.description',
        label: 'Description',
        type: 'string'
      },
      {
        name: 'listing.property.full_bathroom_count',
        label: 'Full Bathrooms',
        type: 'number'
      },
      {
        name: 'listing.property.half_bathroom_count',
        label: 'Half Bathrooms',
        type: 'number'
      },
      {
        name: 'listing.property.square_meters',
        label: 'Area',
        type: 'string'
      }
    ]
  },
  {
    label: 'Agent Info',
    items: [
      {
        name: 'user.display_name',
        label: 'Agent Name',
        type: 'string'
      },
      {
        name: 'user.email',
        label: 'Agent Email',
        type: 'string'
      },
      {
        name: 'user.phone_number',
        label: 'Agent Phone',
        type: 'string'
      },
      {
        name: 'user.profile_image_url',
        label: 'Agent Photo',
        type: 'image'
      }
    ]
  },
  {
    label: 'Photos',
    items: [
      {
        name: 'listing.gallery_image_urls.0',
        label: 'Listing Photo',
        type: 'image'
      },
      {
        name: 'listing.gallery_image_urls.1',
        label: 'Listing Photo 2',
        type: 'image'
      },
      {
        name: 'listing.gallery_image_urls.2',
        label: 'Listing Photo 3',
        type: 'image'
      },
      {
        name: 'listing.gallery_image_urls.3',
        label: 'Listing Photo 4',
        type: 'image'
      },
      {
        name: 'listing.gallery_image_urls.4',
        label: 'Listing Photo 5',
        type: 'image'
      },
      {
        name: 'listing.gallery_image_urls.5',
        label: 'Listing Photo 6',
        type: 'image'
      },
      {
        name: 'listing.gallery_image_urls.6',
        label: 'Listing Photo 7',
        type: 'image'
      },
      {
        name: 'listing.gallery_image_urls.7',
        label: 'Listing Photo 8',
        type: 'image'
      }
    ]
  }
]
