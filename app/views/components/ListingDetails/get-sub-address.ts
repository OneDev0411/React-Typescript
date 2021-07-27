export function getSubAddress(listing: IListing): string {
  // eslint-disable-next-line max-len
  return `${listing.property.address.city}, ${listing.property.address.state} ${listing.property.address.postal_code}`
}
