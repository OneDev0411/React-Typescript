import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import {
  hasCreateSuperCampaignButton,
  hasSaveAsTemplateButton
} from '../helpers/builder-actions'
import getTemplateObject from '../helpers/get-template-object'

function checkTemplateMedium(
  template: Nullable<IBrandMarketingTemplate>,
  medium: IMarketingTemplateMedium
): boolean {
  if (!template) {
    return false
  }

  return getTemplateObject(template).medium === medium
}

export interface UseMarketingBuilderActions {
  isWebsiteMedium: boolean
  shouldShowCreateSuperCampaignButton: boolean
  shouldShowSaveAsTemplateButton: boolean
}

export function useMarketingBuilderActions(
  template: Nullable<IBrandMarketingTemplate>,
  templateTypes: string[],
  bareMode: boolean
): UseMarketingBuilderActions {
  // Check mediums
  const isWebsiteMedium = checkTemplateMedium(template, 'Website')
  const isEmailMedium = checkTemplateMedium(template, 'Email')
  const isOpenHouseMedium = templateTypes.includes('CrmOpenHouse')

  // Check user access
  const isAdmin = useAcl(ACL.ADMIN)

  // Check buttons
  const shouldShowCreateSuperCampaignButton = hasCreateSuperCampaignButton(
    bareMode,
    !!template,
    isAdmin,
    isEmailMedium
  )

  const shouldShowSaveAsTemplateButton = hasSaveAsTemplateButton(
    bareMode,
    !!template,
    isAdmin,
    isOpenHouseMedium
  )

  return {
    isWebsiteMedium,
    shouldShowCreateSuperCampaignButton,
    shouldShowSaveAsTemplateButton
  }
}
