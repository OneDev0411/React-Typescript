import { useState } from 'react'

import { useSelector } from 'react-redux'

import useListingsEditorAssets from '@app/hooks/use-listings-editor-assets'
import useSafeState from '@app/hooks/use-safe-state'
import { createTemplateInstance } from '@app/models/instant-marketing/create-template-instance'
import { selectUserImpersonateFirst } from '@app/selectors/user'
import { BulkEmailComposeDrawer } from '@app/views/components/EmailCompose'
import getTemplateObject from '@app/views/components/InstantMarketing/helpers/get-template-object'
import getTemplateInstancePreviewImage from '@app/views/components/InstantMarketing/helpers/get-template-preview-image'
import MarketingTemplateEditor from '@app/views/components/MarketingTemplateEditor'

interface MarketingEmailTemplateEditorProps {
  template: IMarketingTemplateInstance
  onClose: () => void
  initialEmailTo?: IDenormalizedEmailRecipientTagInput[]
  initialEmailSubject?: string
  initialEmailDueAt?: Date
  onEmailSent?: () => void
}

function MarketingEmailTemplateEditor({
  template,
  onClose,
  initialEmailTo,
  initialEmailSubject,
  initialEmailDueAt,
  onEmailSent
}: MarketingEmailTemplateEditorProps) {
  const [isComposeEmailOpen, setIsComposeEmailOpen] = useState(false)

  const [isGettingTemplateInstance, setIsGettingTemplateInstance] =
    useSafeState(false)

  const [emailInfo, setEmailInfo] = useSafeState<
    Nullable<{
      emailBody: string
      templateInstance: IMarketingTemplateInstance
    }>
  >(null)

  const user = useSelector(selectUserImpersonateFirst)

  const openComposeEmail = () => setIsComposeEmailOpen(true)

  const closeComposeEmail = () => {
    setIsComposeEmailOpen(false)
    setEmailInfo(null)
  }

  const handleSave = async (markup: string) => {
    openComposeEmail()

    setIsGettingTemplateInstance(true)

    const templateObject = getTemplateObject(template.template)

    const instance = await createTemplateInstance(templateObject.id, {
      listings: template.listings?.map(listing => listing.id),
      deals: template.deals?.map(deal => deal.id),
      contacts: template.contacts?.map(contact => contact.id),
      html: markup
    })

    setEmailInfo({
      emailBody: getTemplateInstancePreviewImage(instance),
      templateInstance: instance
    })

    setIsGettingTemplateInstance(false)
  }

  const closeBuilder = () => {
    closeComposeEmail()
    onClose()
  }

  const handleEmailSent = () => {
    closeBuilder()
    onEmailSent?.()
  }

  const getEmail = (email: IIndividualEmailCampaignInput) => {
    const templateInstance = emailInfo?.templateInstance

    if (!templateInstance) {
      throw new Error(`Template instance is ${typeof templateInstance}!`)
    }

    const { html, id: template } = templateInstance

    return {
      ...email,
      html,
      template
    }
  }

  const listingAssets = useListingsEditorAssets(template.listings)

  return (
    <>
      <MarketingTemplateEditor
        onClose={closeBuilder}
        onSave={handleSave}
        templateData={{
          user: user!,
          listings: template.listings ?? undefined,
          listing: template.listings?.[0],
          contact: template.contacts?.[0]
        }}
        saveButtonText="Continue"
        assets={listingAssets}
        template={template}
      />

      {isComposeEmailOpen && (
        <BulkEmailComposeDrawer
          isOpen
          hasStaticBody
          initialValues={{
            from: user!,
            to: initialEmailTo,
            subject: initialEmailSubject,
            due_at: initialEmailDueAt,
            body: emailInfo?.emailBody
          }}
          onClose={closeComposeEmail}
          onSent={handleEmailSent}
          getEmail={getEmail}
          isSubmitDisabled={isGettingTemplateInstance}
        />
      )}
    </>
  )
}

export default MarketingEmailTemplateEditor
