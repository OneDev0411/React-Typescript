import React, { useContext } from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { TemplateData } from 'utils/marketing-center/render-branded-template'

import Builder from './Builder'

interface IBrandMarketingTemplateWithResult extends IBrandMarketingTemplate {
  result: string
}

interface Props {
  closeConfirmation?: boolean
  hideTemplatesColumn?: boolean
  templateData?: TemplateData
  templateTypes?: string[]
  mediums?: string
  assets?: string[]
  defaultTemplate?: Nullable<IBrandMarketingTemplate>
  onShowEditListings?: () => void
  containerStyle?: React.CSSProperties
  isTemplatesColumnHiddenDefault?: boolean
  bareMode?: boolean
  saveButtonText?: string
  handleSocialSharing?: (template: IBrandMarketingTemplateWithResult) => void
  handleSave: (
    template: IBrandMarketingTemplateWithResult,
    owner: IUser
  ) => void
  onClose: () => void
}

export default function InstantMarketing({
  closeConfirmation = true,
  hideTemplatesColumn = false,
  templateData = {},
  templateTypes = [],
  mediums = '',
  assets = [],
  defaultTemplate = null,
  onShowEditListings,
  containerStyle = {},
  isTemplatesColumnHiddenDefault = true,
  bareMode = false,
  saveButtonText,
  handleSave,
  handleSocialSharing,
  onClose
}: Props) {
  const confirmation = useContext(ConfirmationModalContext)

  const handleClose = () => {
    if (closeConfirmation) {
      return confirmation.setConfirmationModal({
        message: 'Don’t want to market?',
        description: 'By canceling you will lose any changes you have made.',
        cancelLabel: 'No, don’t cancel',
        confirmLabel: 'Yes, cancel',
        onConfirm: onClose
      })
    }

    onClose()
  }

  return (
    <Builder
      hideTemplatesColumn={hideTemplatesColumn}
      templateData={templateData}
      templateTypes={templateTypes}
      mediums={mediums}
      assets={assets}
      defaultTemplate={defaultTemplate}
      onShowEditListings={onShowEditListings}
      containerStyle={containerStyle}
      isTemplatesColumnHiddenDefault={isTemplatesColumnHiddenDefault}
      bareMode={bareMode}
      saveButtonText={saveButtonText}
      onClose={handleClose}
      onSave={handleSave}
      onSocialSharing={handleSocialSharing}
      onPrintableSharing={handleSocialSharing}
    />
  )
}
