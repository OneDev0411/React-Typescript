import React, { useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  makeStyles
} from '@material-ui/core'

import { MarketingTemplateAndTemplateInstancePickerProps } from 'components/MarketingTemplatePickers/types'
import MarketingTemplateAndTemplateInstancePicker from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePicker'

const useStyles = makeStyles(
  () => ({
    dialogPaper: {
      height: '100%'
    }
  }),
  {
    name: 'MarketingTemplateAndTemplateInstancePickerModal'
  }
)

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
}: MarketingTemplateAndTemplateInstancePickerProps & Props) {
  const classes = useStyles()
  const dialogRef = useRef<HTMLElement>(null)

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      scroll="paper"
      {...dialogProps}
      onClose={onClose}
      classes={{
        paper: classes.dialogPaper
      }}
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
