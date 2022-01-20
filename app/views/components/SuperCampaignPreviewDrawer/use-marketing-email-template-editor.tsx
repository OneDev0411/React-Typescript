import { useState } from 'react'

import { convertTimestampToDate } from '@app/utils/date-utils'

import MarketingEmailTemplateEditor from '../MarketingEmailTemplateEditor'

import { useGetSuperCampaignInitialEmailTo } from './use-get-super-campaign-initial-email-to'

interface UseMarketingEmailTemplateEditor {
  isEmailTemplateEditorOpen: boolean
  openEmailTemplateEditor: () => void
  marketingEmailTemplateEditor: JSX.Element
}

// Rather than implementing a hook, it would be better to have this logic as a component.
// But it does not work in my case because I need the editor open state as long as its JSX
// output and use that state to hide the campaign preview drawer when the editor comes up.
export function useMarketingEmailTemplateEditor(
  superCampaign: Pick<
    ISuperCampaign<'template_instance'>,
    'template_instance' | 'subject' | 'due_at' | 'tags'
  >,
  onEmailSent?: () => void
): UseMarketingEmailTemplateEditor {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const openEditor = () => setIsEditorOpen(true)

  const closeEditor = () => setIsEditorOpen(false)

  const handleEmailSent = () => {
    closeEditor()
    onEmailSent?.()
  }

  const initialEmailTo = useGetSuperCampaignInitialEmailTo(superCampaign.tags)

  return {
    isEmailTemplateEditorOpen: isEditorOpen,
    openEmailTemplateEditor: openEditor,
    marketingEmailTemplateEditor: (
      <>
        {superCampaign.template_instance && isEditorOpen && (
          <MarketingEmailTemplateEditor
            template={superCampaign.template_instance}
            onClose={closeEditor}
            initialEmailTo={initialEmailTo}
            initialEmailSubject={superCampaign.subject}
            initialEmailDueAt={
              superCampaign.due_at
                ? convertTimestampToDate(superCampaign.due_at)
                : undefined
            }
            onEmailSent={handleEmailSent}
          />
        )}
      </>
    )
  }
}
