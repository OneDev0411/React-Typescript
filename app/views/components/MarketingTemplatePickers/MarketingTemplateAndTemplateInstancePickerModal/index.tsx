import { useRef, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  makeStyles,
  Box,
  Typography
} from '@material-ui/core'

import MarketingSearchInput from '@app/views/components/MarketingSearchInput'
import MarketingTemplateAndTemplateInstancePicker from '@app/views/components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePicker'
import {
  MarketingTemplateAndTemplateInstancePickerProps,
  MyDesignsOrTemplateType
} from '@app/views/components/MarketingTemplatePickers/types'

const useStyles = makeStyles(
  () => ({
    dialogPaper: {
      height: '100%'
    },
    searchContainer: {
      minWidth: 300
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
  const [selectedTab, setSelectedTab] =
    useState<Optional<MyDesignsOrTemplateType>>(undefined)

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
      <DialogTitle disableTypography>
        <Box display="flex" justifyContent="space-between">
          <div>
            <Typography variant="h6">{title}</Typography>
          </div>
          {pickerProps.templateTypes.length > 1 && (
            <div className={classes.searchContainer}>
              <MarketingSearchInput
                types={pickerProps.templateTypes.map(type => ({ type }))}
                onSelect={({ type }) => setSelectedTab(type)}
              />
            </div>
          )}
        </Box>
      </DialogTitle>
      <DialogContent ref={dialogRef}>
        <MarketingTemplateAndTemplateInstancePicker
          {...pickerProps}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          containerRef={dialogRef}
        />
      </DialogContent>
    </Dialog>
  )
}
