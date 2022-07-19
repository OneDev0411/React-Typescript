import { WebsiteTabCollection } from '../types'

export const websitesRouteRoot = 'websites'
export const presentationsRouteRoot = 'presentations'

export const PRESENTATION_TEMPLATE_TYPES: IWebsiteTemplateType[] = ['CMA']

export const WEBSITES_DEFAULT_TABS: WebsiteTabCollection = {
  agent: {
    key: 'agent',
    title: 'Agent IDX Sites',
    types: ['Agent']
  },
  properties: {
    key: 'properties',
    title: 'Properties Sites',
    types: ['Listing']
  }
}

export const PRESENTATION_DEFAULT_TABS: WebsiteTabCollection = {
  CMA: {
    key: 'CMA',
    title: 'CMA',
    types: ['CMA']
  }
}
