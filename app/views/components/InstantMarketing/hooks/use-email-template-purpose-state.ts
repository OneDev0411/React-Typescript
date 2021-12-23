import { useState } from 'react'

import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import getTemplateObject from '../helpers/get-template-object'
import { EmailTemplatePurpose } from '../types'

interface UseEmailTemplatePurposeState {
  isEmailPurposeDrawerOpen: boolean
  closeEmailPurposeDrawer: () => void
  emailTemplatePurpose: Nullable<EmailTemplatePurpose>
  setEmailTemplatePurpose: (emailTemplatePurpose: EmailTemplatePurpose) => void
}

export function useEmailTemplatePurposeState(
  template: Nullable<IBrandMarketingTemplate>
): UseEmailTemplatePurposeState {
  const isAdmin = useAcl(ACL.ADMIN)

  const isEmailTemplate =
    !!template && getTemplateObject(template).medium === 'Email'

  const [isEmailPurposeDrawerOpen, setIsDrawerOpen] = useState<boolean>(
    isAdmin && isEmailTemplate
  )

  const [emailTemplatePurpose, setEmailTemplatePurpose] =
    useState<Nullable<EmailTemplatePurpose>>(null)

  const closeEmailPurposeDrawer = () => setIsDrawerOpen(false)

  return {
    isEmailPurposeDrawerOpen,
    closeEmailPurposeDrawer,
    emailTemplatePurpose,
    setEmailTemplatePurpose
  }
}
