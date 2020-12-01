import React from 'react'
import { useTheme } from '@material-ui/core'

import InstantMarketing from 'components/InstantMarketing'
import { TemplateData } from 'utils/marketing-center/render-branded-template'

interface Props {
  /**
   * The marketing template to render inside the template editor
   */
  brandTemplate: IBrandMarketingTemplate

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
   * It will pass the final template edited by user as a string to passed function
   */
  onSave: (markup: string) => void

  /**
   * Close button click handler
   */
  onClose: () => void
}

export default function MarketingTemplateEditor({
  brandTemplate,
  templateData = {},
  saveButtonText = 'Save',
  onSave,
  onClose
}: Props) {
  const theme = useTheme()

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
      defaultTemplate={brandTemplate}
      containerStyle={{ zIndex: theme.zIndex.modal + 1 }}
      handleSave={template => onSave(template.markup)}
      onClose={onClose}
    />
  )
}
