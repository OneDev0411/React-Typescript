function getListingTitle(activity) {
  const { type } = activity.object
  let listing
  let title

  if (type === 'message') {
    listing = activity.object.recommendation.listing
  } else if (type === 'recommendation') {
    listing = activity.object.listing
  } else if (type === 'listing') {
    listing = activity.object
  }

  if (!listing) {
    return ''
  }

  // get address object
  const { address } = listing.property

  title = address.street_number
  title += ` ${address.street_name}`

  if (address.street_suffix) {
    title += ` ${address.street_suffix}`
  }

  if (address.unit_number) {
    title += `, Unit ${address.unit_number}`
  }

  return title
}

function getAlertTitle(activity) {
  const alert = activity.object
  const { title, proposed_title } = alert

  return title && title.length > 0 ? title : proposed_title
}

function getListingPhoto({ cover_image_url }) {
  if (!cover_image_url) {
    return '/static/images/deals/home.svg'
  }

  return cover_image_url
}

function getListingUrl({ id }) {
  return `/dashboard/mls/${id}`
}

export function UserViewedAlert(activity, name) {
  return {
    title: `${name} <b>viewed an alert</b> ${getAlertTitle(activity)}`,
    icon: 'alert-fill'
  }
}

export function UserViewedListing(activity, name) {
  return {
    title: `${name} <b>viewed</b> ${getListingTitle(activity)}`,
    image: getListingPhoto(activity.object),
    url: getListingUrl(activity.object),
    icon: 'group-142'
  }
}

export function UserFavoritedListing(activity, name) {
  const { listing } = activity.object

  return {
    title: `${name} <b>favorited</b> ${getListingTitle(activity)}`,
    image: getListingPhoto(listing),
    url: getListingUrl(listing),
    icon: 'heart'
  }
}

export function UserSharedListing(activity, name) {
  return {
    title: `${name} <b>shared</b> ${getListingTitle(activity)}`,
    image: getListingPhoto(activity.object),
    url: getListingUrl(activity.object),
    icon: 'group-142'
  }
}

export function UserCreatedAlert(activity, name) {
  return {
    title: `${name} <b>created an alert</b> ${getAlertTitle(activity)}`,
    icon: 'alert-fill'
  }
}

export function UserCommentedRoom(activity, name) {
  return {
    title: `${name} <b>Commented on</b> ${getListingTitle(activity)}`,
    icon: 'comment'
  }
}

export function UserOpenedIOSApp(activity, name) {
  return {
    title: `${name} <b>was active</b> in iOS`,
    icon: 'alert-fill'
  }
}

export function UserCalledContact(activity, name) {
  return {
    title: `You called ${name}`,
    icon: 'alert-fill'
  }
}

export function UserReactedToEnvelopeForSubmission(activity, name) {
  return {
    title: `${name} <b>updated</b> a document`,
    icon: 'alert-fill'
  }
}

export function UserUpdatedReview(activity, name) {
  return {
    title: `${name} <b>updated</b> a task review`,
    icon: 'alert-fill'
  }
}

export function UserCompletedSubmission(activity, name) {
  return {
    title: `${name} <b>completed</b> a submission`,
    icon: 'alert-fill'
  }
}

export function UserUpdatedSubmission(activity, name) {
  return {
    title: `${name} <b>updated</b> a submission`,
    icon: 'alert-fill'
  }
}

export function UserCreatedEnvelopeForSubmission(activity, name) {
  return {
    title: `${name} <b>sent</b> a document`,
    icon: 'alert-fill'
  }
}

export function UserViewedFile(activity, name) {
  return {
    title: `${name} <b>viewed</b> a file`,
    icon: 'alert-fill'
  }
}

export function UserInvited(activity, name) {
  return {
    title: `${name} <b>was invited</b> to Rechat`,
    icon: 'alert-fill'
  }
}

export function UserSignedUp(activity, name) {
  return {
    title: `${name} <b>signed up</b> to Rechat`,
    icon: 'alert-fill'
  }
}

// export function UserCreatedContact(activity) {
//   const sourceType = Contact.get.source(activity.object).name
//   let title = 'Contact created'

//   switch (sourceType) {
//     case 'BrokerageWidget':
//       title += ' from brokerage widget'
//       break
//     case 'IOSAddressBook':
//       title += ' from your address book'
//       break
//     case 'SharesRoom':
//       title += ' because you shared a room with this user'
//       break
//     case 'ExplicitlyCreated':
//       title += ' by you'
//       break
//   }

//   return {
//     title,
//     icon: 'alert-fill'
//   }
// }
