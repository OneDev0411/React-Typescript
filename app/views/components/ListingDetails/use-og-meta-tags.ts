import { useEffect } from 'react'

import listingUtils from 'utils/listing'

/* 
    In order for Facebook and Twitter crawlers to find our open graph meta tags, 
    We need to place them on the top 1M of our page
    Hemlet does not currently support placement, see:
    https://developers.facebook.com/docs/sharing/webmasters/crawler/
    https://github.com/jimmay5469/react-helmet  
*/
export function useOgMetaTags(listing: IListing<'proposed_agent'> | null) {
  useEffect(() => {
    if (listing) {
      const subtitle1 = listingUtils.addressTitle(listing.property.address)
      const subtitle2 = [
        listingUtils.getListingAddressLine2(listing),
        `MLS#: ${listing.mls_number}`
      ].join(' | ')
      const images = listing.gallery_image_urls || []

      const ogTitle = subtitle1
      const ogImage =
        images[0] || '/static/images/favicons/apple-touch-icon.png'

      const ogMetaTagsInfo = [
        {
          id: 'og:title',
          property: 'og:title',
          content: ogTitle
        },
        {
          id: 'twitter:title',
          name: 'twitter:title',
          content: ogTitle
        },
        {
          id: 'og:description',
          property: 'og:description',
          content: subtitle2
        },
        {
          id: 'twitter:description',
          name: 'twitter:description',
          content: subtitle2
        },
        {
          id: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          id: 'og:image',
          property: 'og:image',
          content: ogImage
        },
        {
          id: 'twitter:image',
          name: 'twitter:image',
          content: ogImage
        }
      ]

      const ogMetaTagsElements: HTMLMetaElement[] =
        createMetaTags(ogMetaTagsInfo)

      // prepend og tags to the head of the document.
      const head = document.querySelector('head')

      head?.prepend(...ogMetaTagsElements)
    }
  }, [listing])
}

interface IOgMetaTagsInfo {
  id?: string
  property: string
  name: string
  content: string
}

// Create a set of og meta tag elements
function createMetaTags(
  ogMetaTagsInfo: RequireAtLeastOne<IOgMetaTagsInfo, 'name' | 'property'>[]
) {
  const metas: HTMLMetaElement[] = []

  ogMetaTagsInfo.forEach(({ id, name, property, content }) => {
    const possibleId = id || name || property

    if (possibleId) {
      // Remove existing meta tags with the same data-id

      const existingMeta = document.querySelector(
        `meta[data-id="${possibleId}"]`
      )

      if (existingMeta) {
        existingMeta.remove()
      }
    }

    const meta = document.createElement('meta')

    if (possibleId) {
      meta.setAttribute('data-id', possibleId)
    }

    if (name) {
      meta.setAttribute('name', name)
    }

    if (property) {
      meta.setAttribute('property', property)
    }

    meta.setAttribute('content', content)

    metas.push(meta)
  })

  return metas
}
