import { useState } from 'react'

import { TemplateData } from '@app/utils/marketing-center/render-branded-template'

import getTemplateObject from '../helpers/get-template-object'

interface UseMarketingTemplatePurposeState {
  isPurposeDrawerOpen: boolean
  closePurposeDrawer: () => void
  templatePurpose: Optional<IMarketingTemplatePurpose>
  setTemplatePurpose: (templatePurpose: IMarketingTemplatePurpose) => void
  correctedTemplateData: TemplateData
}

// TODO: Check this with Emil and talk over XSS vulnerabilities here
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
  template: Nullable<IBrandMarketingTemplate>,
  templateData: TemplateData,
  initialTemplatePurpose: Optional<IMarketingTemplatePurpose>
): UseMarketingTemplatePurposeState {
  const isWebsiteTemplate =
    !!template && getTemplateObject(template).medium === 'Website' // All types except website types

  const [isPurposeDrawerOpen, setIsDrawerOpen] = useState<boolean>(
    !isWebsiteTemplate && !initialTemplatePurpose
  )

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
