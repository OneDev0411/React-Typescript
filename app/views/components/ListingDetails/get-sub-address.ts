export function getSubAddress(listing: IListing): string {
  return `${listing.property.address.city}, ${listing.property.address.state} ${listing.property.address.postal_code}`
}
