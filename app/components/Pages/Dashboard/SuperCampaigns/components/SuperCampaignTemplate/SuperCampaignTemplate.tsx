import { useState } from 'react'

import SuperCampaignSectionHeader, {
  SuperCampaignSectionHeaderProps
} from '../SuperCampaignSectionHeader'

import SuperCampaignTemplateEditor from './SuperCampaignTemplateEditor'
import SuperCampaignTemplatePreview from './SuperCampaignTemplatePreview'

interface SuperCampaignTemplateProps
  extends Pick<SuperCampaignSectionHeaderProps, 'titleVariant'> {
  titleClassName?: string
  template: IMarketingTemplateInstance
  onTemplateChange: (
    template: IMarketingTemplateInstance
  ) => Promise<void> | void
  onEditorOpen?: () => void
  onEditorClose?: () => void
}

function SuperCampaignTemplate({
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
    <>
      <SuperCampaignSectionHeader
        className={titleClassName}
        title="Template"
        titleVariant={titleVariant}
        actionLabel="Edit"
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
    </>
  )
}

export default SuperCampaignTemplate
