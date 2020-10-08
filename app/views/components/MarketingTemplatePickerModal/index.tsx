import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps
} from '@material-ui/core'

import MarketingTemplatePicker from 'components/MarketingTemplatePicker'

interface Props {
  title?: string
  dialogProps?: Omit<DialogProps, 'open' | 'onCloses'>
  onClose: () => void
}

export default function MarketingTemplatePickerModal({
  title = 'Select Template',
  dialogProps = {},
  onClose,
  ...marketingTemplatePickerProps
}: Props & React.ComponentProps<typeof MarketingTemplatePicker>) {
  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      scroll="paper"
      {...dialogProps}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <MarketingTemplatePicker {...marketingTemplatePickerProps} />
      </DialogContent>
    </Dialog>
  )
}
