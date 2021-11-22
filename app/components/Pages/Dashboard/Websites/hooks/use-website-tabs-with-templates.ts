import { mapValues } from 'lodash'

import { WebsiteTabWithTemplatesCollection } from '../types'

import useWebsiteTabs from './use-website-tabs'

function useWebsiteTabsWithTemplates(
  templates: IBrandMarketingTemplate[]
): WebsiteTabWithTemplatesCollection {
  const tabs = useWebsiteTabs()

  return mapValues(tabs, tab => ({
    ...tab,
    templates: templates.filter(template =>
      tab.types.includes(template.template.template_type)
    )
  }))
}

export default useWebsiteTabsWithTemplates
