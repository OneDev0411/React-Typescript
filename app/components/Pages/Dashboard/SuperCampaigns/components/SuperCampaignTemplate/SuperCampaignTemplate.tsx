import { useState } from 'react'

import SuperCampaignSectionHeader, {
  SuperCampaignSectionHeaderProps
} from '../SuperCampaignSectionHeader'

import SuperCampaignTemplateEditor from './SuperCampaignTemplateEditor'
import SuperCampaignTemplatePreview from './SuperCampaignTemplatePreview'

interface SuperCampaignTemplateProps
  extends Pick<SuperCampaignSectionHeaderProps, 'titleVariant'> {
  className?: string
  titleClassName?: string
  template: IMarketingTemplateInstance
  onTemplateChange: (
    template: IMarketingTemplateInstance
  ) => Promise<void> | void
  onEditorOpen?: () => void
  onEditorClose?: () => void
}

function SuperCampaignTemplate({
  className,
  titleClassName,
  titleVariant,
  template,
  onTemplateChange,
  onEditorOpen,
  onEditorClose
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
    <div className={className}>
      <SuperCampaignSectionHeader
        className={titleClassName}
        title="Template"
        titleVariant={titleVariant}
        actionLabel="Edit Template"
        onActionClick={openEditor}
      />
      <SuperCampaignTemplatePreview template={template} onClick={openEditor} />
      {isEditorOpen && (
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
