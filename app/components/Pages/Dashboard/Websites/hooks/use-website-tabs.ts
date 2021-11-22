import { omitBy, mapValues, merge } from 'lodash'

import {
  SectionCollection,
  useMarketingCenterSections
} from '@app/hooks/use-marketing-center-sections'
import { SectionsEnum } from 'components/PageSideNav/types'

import { WebsiteTab, WebsiteTabCollection } from '../types'

const DEFAULT_TABS: WebsiteTabCollection = {
  agent: {
    key: 'agent',
    title: 'Agent IDX',
    types: ['Agent']
  },
  properties: {
    key: 'properties',
    title: 'Properties',
    types: ['Listing']
  }
}

function useWebsiteTabs(): WebsiteTabCollection {
  const marketingSections = useMarketingCenterSections({ types: '' }) // TODO: Ask Mamal about this

  const websiteSections = omitBy(
    marketingSections,
    section => section.type === SectionsEnum.Link
  )

  const extractedWebsiteTabs = mapValues<SectionCollection, WebsiteTab>(
    websiteSections,
    section => ({
      key: section.key,
      title: section.title,
      types: section.items.reduce((allTypes, item) => {
        if (!item.value) {
          return allTypes
        }

        const itemsTypes = Array.isArray(item.value) ? item.value : [item.value]

        return [...allTypes, ...itemsTypes]
      }, [])
    })
  )

  return merge(extractedWebsiteTabs, DEFAULT_TABS)
}

export default useWebsiteTabs
