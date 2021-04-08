import { useSelector } from 'react-redux'

import { selectActiveBrandId } from 'selectors/brand'

import { useTemplates } from '../../Marketing/hooks/use-templates'

const mediums: IWebsiteTemplateMedium[] = ['Website']

function useWebsiteTemplates(type?: IWebsiteTemplateType) {
  const brandId = useSelector(selectActiveBrandId)

  return useTemplates(brandId, mediums, type ? [type] : undefined)
}

export default useWebsiteTemplates
