import { useState } from 'react'

import SuperCampaignCardHeader, {
  SuperCampaignCardHeaderProps
} from '../SuperCampaignCardHeader'

import SuperCampaignTemplateEditor from './SuperCampaignTemplateEditor'
import SuperCampaignTemplatePreview from './SuperCampaignTemplatePreview'

interface SuperCampaignTemplateProps
  extends Pick<SuperCampaignCardHeaderProps, 'titleVariant'> {
  className?: string
  titleClassName?: string
  template: IMarketingTemplateInstance
  onTemplateChange: (
    template: IMarketingTemplateInstance
  ) => Promise<void> | void
  onEditorOpen?: () => void
  onEditorClose?: () => void
  readOnly?: boolean
  viewAsAdmin?: boolean
}

function SuperCampaignTemplate({
  className,
  titleClassName,
  titleVariant,
  template,
  onTemplateChange,
  onEditorOpen,
  onEditorClose,
  readOnly = false,
  viewAsAdmin
}: SuperCampaignTemplateProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const openEditor = () => {
    setIsEditorOpen(true)
    onEditorOpen?.()
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    onEditorClose?.()
  }

  const handleEditorSave = async (template: IMarketingTemplateInstance) => {
    await onTemplateChange(template)
    closeEditor()
  }

  return (
    <div className={className} data-test="super-campaign-detail-template">
      <SuperCampaignCardHeader
        className={titleClassName}
        title="Template"
        titleVariant={titleVariant}
        actionLabel={!readOnly ? 'Edit Template' : undefined}
        onActionClick={openEditor}
      />
      <SuperCampaignTemplatePreview
        template={template}
        onClick={openEditor}
        readOnly={readOnly}
        viewAsAdmin={viewAsAdmin}
      />
      {!readOnly && isEditorOpen && (
        <SuperCampaignTemplateEditor
          template={template}
          onClose={closeEditor}
          onTemplateSave={handleEditorSave}
        />
      )}
    </div>
  )
}

export default SuperCampaignTemplate
