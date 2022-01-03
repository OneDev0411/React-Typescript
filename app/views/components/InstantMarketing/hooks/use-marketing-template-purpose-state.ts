import { useState } from 'react'

import { TemplateData } from '@app/utils/marketing-center/render-branded-template'

import type { UseMarketingBuilderActions } from './use-marketing-builder-actions'

interface UseMarketingTemplatePurposeState {
  isPurposeDrawerOpen: boolean
  closePurposeDrawer: () => void
  templatePurpose: Optional<IMarketingTemplatePurpose>
  setTemplatePurpose: (templatePurpose: IMarketingTemplatePurpose) => void
  correctedTemplateData: TemplateData
}

// TODO: Check this with Emil and ask about XSS vulnerabilities on this logic
function getUserWithVariableFields(user: IUser): IUser {
  return {
    ...user,
    profile_image_url: '{{user.profile_image_url}}',
    display_name: '{{user.display_name}}',
    phone_number: '{{user.phone_number}}',
    email: '{{user.email}}',
    facebook: '{{user.facebook}}',
    twitter: '{{user.twitter}}',
    linkedin: '{{user.linkedin}}',
    youtube: '{{user.youtube}}',
    instagram: '{{user.instagram}}'
  }
}

export function useMarketingTemplatePurposeState(
  builderActions: UseMarketingBuilderActions,
  templateData: TemplateData,
  initialTemplatePurpose: Optional<IMarketingTemplatePurpose>
): UseMarketingTemplatePurposeState {
  const [isPurposeDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => {
    // Do not ask the question if the programmes has already set the answer
    if (initialTemplatePurpose) {
      return false
    }

    // Do not ask the question for website medium
    if (builderActions.isWebsiteMedium) {
      return false
    }

    // Ask the question if there are more than one answer
    if (
      !builderActions.shouldShowCreateSuperCampaignButton &&
      !builderActions.shouldShowSaveAsTemplateButton
    ) {
      return false
    }

    return true
  })

  const [templatePurpose, setTemplatePurpose] = useState<
    Optional<IMarketingTemplatePurpose>
  >(initialTemplatePurpose)

  const closePurposeDrawer = () => setIsDrawerOpen(false)

  const correctedTemplateData: TemplateData =
    templateData.user &&
    templatePurpose &&
    ['ForOtherAgents', 'ForCampaigns'].includes(templatePurpose)
      ? {
          ...templateData,
          user: getUserWithVariableFields(templateData.user)
        }
      : templateData

  return {
    isPurposeDrawerOpen,
    closePurposeDrawer,
    templatePurpose,
    setTemplatePurpose,
    correctedTemplateData
  }
}
