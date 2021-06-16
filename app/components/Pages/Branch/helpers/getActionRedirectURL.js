import { encodeURI } from 'js-base64'

const getActionRedirectURL = params => {
  const { action, room, alert, listing, files, crm_task } = params

  if (action === 'RedirectToRoom' && room) {
    return `/dashboard/recents/${room}`
  }

  if (action === 'RedirectToAlert' && alert) {
    return `/dashboard/mls/saved-searches/${alert}`
  }

  if (action === 'RedirectToListing' && listing) {
    return `/dashboard/mls/${listing}`
  }

  if (crm_task && action === 'RedirectToCRMTask') {
    return `/dashboard/notifications/crm/${crm_task}`
  }

  if (action === 'RedirectToContact') {
    return `/dashboard/contacts/${params.contact}`
  }

  if (action === 'RedirectToDeal') {
    return `/dashboard/deals/${params.deal}`
  }

  if (action === 'OpenMarketingWizard') {
    if (files && files.length) {
      return `/dashboard/marketing/wizard?imageUrls=${files
        .map(file => encodeURI(file.url))
        .join(',')}`
    }

    if (listing) {
      return `/dashboard/marketing/wizard?listingId=${listing}`
    }
  }

  return '/dashboard/mls/'
}

export default getActionRedirectURL
