import { useState } from 'react'

import SuperCampaignTemplateEditor from '../SuperCampaignTemplateEditor'

import SuperCampaignOverviewDetailTemplatePreview from './SuperCampaignOverviewDetailTemplatePreview'
import SuperCampaignOverviewDetailTitle from './SuperCampaignOverviewDetailTitle'

interface SuperCampaignOverviewDetailTemplateProps {
  titleClassName: string
  template: IMarketingTemplateInstance
  onTemplateChange: (template: IMarketingTemplateInstance) => Promise<void>
}

function SuperCampaignOverviewDetailTemplate({
  titleClassName,
  template,
  onTemplateChange
}: SuperCampaignOverviewDetailTemplateProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const openEditor = () => setIsEditorOpen(true)

  const closeEditor = () => setIsEditorOpen(false)

  const handleTemplateSave = async (template: IMarketingTemplateInstance) => {
    await onTemplateChange(template)
    closeEditor()
  }

  return (
    <>
      <SuperCampaignOverviewDetailTitle
        className={titleClassName}
        title="Template"
        actionLabel="Edit"
        onActionClick={openEditor}
      />
      <SuperCampaignOverviewDetailTemplatePreview
        template={template}
        onClick={openEditor}
      />
      {isEditorOpen && (
        <SuperCampaignTemplateEditor
          template={template}
          onClose={closeEditor}
          onTemplateSave={handleTemplateSave}
        />
      )}
    </>
  )
}

export default SuperCampaignOverviewDetailTemplate
