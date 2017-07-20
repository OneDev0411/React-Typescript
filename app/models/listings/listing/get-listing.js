import Fetch from '../../../services/fetch'

const getListing = async id => {
  if (!id) {
    return
  }

  try {
    const response = await new Fetch().get(
      `/listings/${id}/?associations=compact_listing.proposed_agent`
    )

    let listing = response.body.data
    listing = {
      ...listing,
      numPoints: 1,
      list: listing,
      lat: listing.property.address.location.latitude,
      lng: listing.property.address.location.longitude
    }

    return listing
  } catch (error) {
    throw error
  }
}

export default getListing
