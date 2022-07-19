import { mapValues, merge } from 'lodash'

import {
  WebsiteTabCollection,
  WebsiteTabWithTemplatesCollection
} from '../types'

import useExtractedWebsiteTabs from './use-website-tabs'

function useWebsiteTabsWithTemplates(
  templates: IBrandMarketingTemplate[],
  defaultTabs: WebsiteTabCollection,
  shouldUseExtractedWebsiteTabs = true
): WebsiteTabWithTemplatesCollection {
  const extractedWebsiteTabs = useExtractedWebsiteTabs()

  const tabs = shouldUseExtractedWebsiteTabs
    ? merge(extractedWebsiteTabs, defaultTabs)
    : defaultTabs

  return mapValues(tabs, tab => ({
    ...tab,
    templates: templates.filter(template =>
      tab.types.includes(template.template.template_type)
    )
  }))
}

export default useWebsiteTabsWithTemplates
