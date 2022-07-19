import { useSelector } from 'react-redux'

import { selectActiveBrandId } from 'selectors/brand'

import { useTemplates } from '../../Marketing/hooks/use-templates'

const mediums: IWebsiteTemplateMedium[] = ['Website']

interface UseWebsiteTemplates {
  typesWhiteList?: IWebsiteTemplateType[]
  typesBlackList?: IWebsiteTemplateType[]
}

function useWebsiteTemplates(
  props: UseWebsiteTemplates = {
    typesWhiteList: undefined,
    typesBlackList: undefined
  }
) {
  const { typesWhiteList, typesBlackList } = props
  const brandId = useSelector(selectActiveBrandId)

  const templates = useTemplates(brandId, mediums, typesWhiteList)

  if (typesBlackList) {
    return {
      ...templates,
      templates: templates.templates.filter(
        template =>
          !typesBlackList.includes(
            template.template.template_type as IWebsiteTemplateType
          )
      )
    }
  }

  return templates
}

export default useWebsiteTemplates
