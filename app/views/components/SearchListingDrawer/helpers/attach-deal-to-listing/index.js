import { getField } from 'models/Deal/helpers/context/get-field'

export function attachDealDataToListing(deal, listing) {
  return {
    ...listing,
    price: getField(deal, 'list_price') || listing.price,
    property: {
      ...listing.property,
      address: {
        ...listing.property.address,
        city: getField(deal, 'city') || listing.property.address.city,
        state: getField(deal, 'state') || listing.property.address.state,
        full_address:
          getField(deal, 'full_address') ||
          listing.property.address.full_address,
        street_address:
          getField(deal, 'street_address') ||
          listing.property.address.street_address,
        unit_number:
          getField(deal, 'unit_number') || listing.property.address.unit_number,
        street_name:
          getField(deal, 'street_name') || listing.property.address.street_name,
        street_number:
          getField(deal, 'street_number') ||
          listing.property.address.street_number,
        street_suffix:
          getField(deal, 'street_suffix') ||
          listing.property.address.street_suffix,
        postal_code:
          getField(deal, 'postal_code') || listing.property.address.postal_code
      },
      list_date: getField(deal, 'list_date') || listing.list_date,
      status: getField(deal, 'listing_status') || listing.status,
      year_built: getField(deal, 'year_built') || listing.property.year_built
    }
  }
}
