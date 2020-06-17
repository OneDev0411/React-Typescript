import React, { useContext } from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import Builder from './Builder'

interface Props {
  closeConfirmation?: boolean
  hideTemplatesColumn?: boolean
  templateData?: {
    user?: IUser
    listing?: IListing
    listings?: IListing[]
  }
  templateTypes?: string[]
  mediums?: string
  assets?: string[]
  defaultTemplate?: Nullable<IBrandMarketingTemplate>
  containerStyle?: React.CSSProperties
  handleSave: (markup: string, owner: IUser) => void
  handleSocialSharing: (markup: string, socialNetworkName: string) => void
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
  containerStyle = {},
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
      containerStyle={containerStyle}
      onClose={handleClose}
      onSave={handleSave}
      onSocialSharing={handleSocialSharing}
    />
  )
}
