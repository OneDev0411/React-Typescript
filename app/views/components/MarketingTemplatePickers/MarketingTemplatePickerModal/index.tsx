import React, { useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  makeStyles
} from '@material-ui/core'

import { MarketingTemplatePickerProps } from 'components/MarketingTemplatePickers/types'
import MarketingTemplatePicker from 'components/MarketingTemplatePickers/MarketingTemplatePicker'

const useStyles = makeStyles(
  () => ({
    dialogPaper: {
      height: '100%'
    }
  }),
  {
    name: 'MarketingTemplatePickerModal'
  }
)

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
}: MarketingTemplatePickerProps & Props) {
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
        <MarketingTemplatePicker
          {...marketingTemplatePickerProps}
          containerRef={dialogRef}
        />
      </DialogContent>
    </Dialog>
  )
}
