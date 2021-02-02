import React from 'react'

import { TemplateData } from 'utils/marketing-center/render-branded-template'
import { convertToTemplate } from 'utils/marketing-center/helpers'

import InstantMarketing from 'components/InstantMarketing'

interface Props {
  /**
   * The marketing template or template instance to render inside the template editor
   */
  template: IBrandMarketingTemplate | IMarketingTemplateInstance

  /**
   * The template data needed by selected template to render with nunjucks
   *
   * This is an object that can contain any of these:
   * user, contact, listing, listings
   *
   * If you don't pass needed template data to this object,
   * you may get render errors from nunjucks
   */
  templateData?: TemplateData

  /**
   * The save button text/copy
   */
  saveButtonText?: string

  /**
   * Save button click handler
   *
   * It will pass the final edited template by user as a string to this function
   */
  onSave: (markup: string) => void

  /**
   * Close button click handler
   */
  onClose: () => void
}

export default function MarketingTemplateEditor({
  template,
  templateData = {},
  saveButtonText = 'Save',
  onSave,
  onClose
}: Props) {
  // We need to convert template instance to a brand marketing template
  // Our MC editor is dumb and it only works with brand marketing templates
  const brandMarketingTemplate: IBrandMarketingTemplate =
    template.type === 'template_instance'
      ? convertToTemplate(template)
      : template

  return (
    <InstantMarketing
      bareMode
      saveButtonText={saveButtonText}
      closeConfirmation={false}
      isTemplatesColumnHiddenDefault
      hideTemplatesColumn
      templateData={templateData}
      templateTypes={[]}
      mediums=""
      assets={[]}
      defaultTemplate={brandMarketingTemplate}
      handleSave={template => onSave(template.result)}
      onClose={onClose}
    />
  )
}
