import React, { useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps
} from '@material-ui/core'

import MarketingTemplateAndTemplateInstancePicker from 'components/MarketingTemplateAndTemplateInstancePicker'

interface Props {
  title?: string
  dialogProps?: Omit<DialogProps, 'open' | 'onCloses'>
  onClose: () => void
}

export default function MarketingTemplateAndTemplateInstancePickerModal({
  title = 'Select Template',
  dialogProps = {},
  onClose,
  ...pickerProps
}: Props &
  React.ComponentProps<typeof MarketingTemplateAndTemplateInstancePicker>) {
  const dialogRef = useRef<HTMLElement>(null)

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
      <DialogContent ref={dialogRef}>
        <MarketingTemplateAndTemplateInstancePicker
          {...pickerProps}
          containerRef={dialogRef}
        />
      </DialogContent>
    </Dialog>
  )
}
