export function normalizeList(listings) {
  const initialList = {}

  const addTolist = (id, listing, type) => {
    if (initialList[id]) {
      initialList[id] = {
        ...initialList[id],
        listings: [...initialList[id].listings, listing]
      }
    } else {
      const {
        [`${type}_agent_mls_id`]: id,
        [`${type}_agent_full_name`]: name,
        [`${type}_office_name`]: company,
        [`${type}_agent_email`]: email,
        [`${type}_agent_direct_work_phone`]: phone
      } = listing

      initialList[id] = {
        id,
        name,
        company,
        email,
        phone,
        listings: [listing]
      }
    }
  }

  listings.forEach(listing => {
    const { list_agent_mls_id, selling_agent_mls_id } = listing

    if (list_agent_mls_id) {
      addTolist(list_agent_mls_id, listing, 'list')
    }

    if (selling_agent_mls_id && selling_agent_mls_id !== list_agent_mls_id) {
      addTolist(list_agent_mls_id, listing, 'selling')
    }
  })

  return Object.values(initialList).map(({ listings, ...rest }) => {
    const addPrice = (accumulator, listing) => accumulator + listing.price

    const asBuyers = []
    const asListing = []
    const indexedList = {}
    const soldListings = []
    const listingsTotalVolume = listings.reduce(addPrice, 0)

    listings.forEach(listing => {
      if (listing.list_agent_mls_id) {
        asListing.push(listing.id)
      } else {
        asBuyers.push(listing.id)
      }

      if (listing.status === 'sold') {
        soldListings.push(listings)
      }

      indexedList[listing.id] = listing
    })

    return {
      ...rest,
      asListing,
      asBuyers,
      listingsTotalVolume,
      listings: indexedList,
      listingsCount: listings.length,
      soldListings: soldListings.map(l => l.id),
      listingsAveragePrice:
        listingsTotalVolume > 0 ? listingsTotalVolume / listings.length : 0
    }
  })
}
