import { useRef, useState } from 'react'

import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  makeStyles
} from '@material-ui/core'

import MarketingSearchInput from '@app/views/components/MarketingSearchInput'
import MarketingTemplatePicker from '@app/views/components/MarketingTemplatePickers/MarketingTemplatePicker'
import { MarketingTemplatePickerProps } from '@app/views/components/MarketingTemplatePickers/types'

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
  const [selectedTab, setSelectedTab] =
    useState<Optional<IMarketingTemplateType>>(undefined)

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
          {marketingTemplatePickerProps.templateTypes.length > 1 && (
            <div className={classes.searchContainer}>
              <MarketingSearchInput
                types={marketingTemplatePickerProps.templateTypes.map(type => ({
                  type
                }))}
                onSelect={({ type }) => setSelectedTab(type)}
              />
            </div>
          )}
        </Box>
      </DialogTitle>
      <DialogContent ref={dialogRef}>
        <MarketingTemplatePicker
          {...marketingTemplatePickerProps}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          containerRef={dialogRef}
        />
      </DialogContent>
    </Dialog>
  )
}
