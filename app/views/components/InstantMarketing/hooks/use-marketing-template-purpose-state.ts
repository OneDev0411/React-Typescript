import { useState } from 'react'

import { getRecipientPlaceholders } from '@app/utils/marketing-center/get-recipient-placeholders'
import { getUserWithOnBehalfVariable } from '@app/utils/marketing-center/get-user-with-on-behalf-variable'
import { TemplateData } from '@app/utils/marketing-center/render-branded-template'

import type { UseMarketingBuilderActions } from './use-marketing-builder-actions'

interface UseMarketingTemplatePurposeState {
  isPurposeDrawerOpen: boolean
  templatePurpose: Optional<IMarketingTemplatePurpose>
  handleTemplatePurposeSelect: (
    templatePurpose: IMarketingTemplatePurpose
  ) => void
  correctedTemplateData: TemplateData
}

export function useMarketingTemplatePurposeState(
  builderActions: UseMarketingBuilderActions,
  templateData: TemplateData,
  initialTemplatePurpose: Optional<IMarketingTemplatePurpose>
): UseMarketingTemplatePurposeState {
  const [isPurposeDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => {
    // Do not ask the question if the user has already set the answer
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

  const handleTemplatePurposeSelect = (
    templatePurpose: IMarketingTemplatePurpose
  ) => {
    setTemplatePurpose(templatePurpose)
    closePurposeDrawer()
  }

  const correctedTemplateData: TemplateData =
    templateData.user &&
    templatePurpose &&
    ['ForOtherAgents', 'ForCampaigns'].includes(templatePurpose)
      ? {
          ...templateData,
          user: getUserWithOnBehalfVariable(templateData.user)
        }
      : templateData

  const correctedTemplateDataWithPlaceholders = {
    ...correctedTemplateData,
    // The sender object includes the sender placeholders if the templatePurpose is ForOtherAgents or ForCampaigns
    // Otherwise, it should be equal to the current user
    sender: correctedTemplateData.user,
    recipient: getRecipientPlaceholders()
  }

  return {
    isPurposeDrawerOpen,
    templatePurpose,
    handleTemplatePurposeSelect,
    correctedTemplateData: correctedTemplateDataWithPlaceholders
  }
}
