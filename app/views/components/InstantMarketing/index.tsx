import React, { useContext, ReactNode } from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { TemplateData } from 'utils/marketing-center/render-branded-template'

import Builder from './Builder'

export interface IBrandMarketingTemplateWithResult
  extends IBrandMarketingTemplate {
  result: string
}

export interface InstantMarketingProps {
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
  saveButtonStartIcon?: ReactNode
  handleSocialSharing?: (template: IBrandMarketingTemplateWithResult) => void
  handleSave: (
    template: IBrandMarketingTemplateWithResult,
    owner: IUser
  ) => void
  onClose: () => void
  actionButtonsDisabled?: boolean
  customActions?: ReactNode
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
  saveButtonStartIcon,
  handleSave,
  handleSocialSharing,
  onClose,
  actionButtonsDisabled = false,
  customActions
}: InstantMarketingProps) {
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
      saveButtonStartIcon={saveButtonStartIcon}
      onClose={handleClose}
      onSave={handleSave}
      onSocialSharing={handleSocialSharing}
      onPrintableSharing={handleSocialSharing}
      actionButtonsDisabled={actionButtonsDisabled}
      customActions={customActions}
    />
  )
}
