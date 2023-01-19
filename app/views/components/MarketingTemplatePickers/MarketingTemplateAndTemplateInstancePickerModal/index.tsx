import { useEffect, useRef, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  makeStyles,
  Box,
  Typography
} from '@material-ui/core'

import { useActiveBrandId } from '@app/hooks/brand'
import { getBrandMarketingCategories } from '@app/models/brand/get-brand-marketing-categories'
import { sortAlphabetically } from '@app/utils/helpers'
import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import MarketingSearchInput, {
  TemplateTypeWithMedium
} from '@app/views/components/MarketingSearchInput'
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

  const activeBrandId = useActiveBrandId()
  const [categories, setCategories] = useState<TemplateTypeWithMedium[]>([])

  useEffect(() => {
    // Load accurate (non-empty) categories list
    async function getCategories() {
      try {
        const brandMarketingCategories = await getBrandMarketingCategories(
          activeBrandId,
          {
            mediums: pickerProps.mediums,
            templateTypes: pickerProps.templateTypes,
            filter: 'template'
          }
        )

        const loadedCategories = brandMarketingCategories
          .sort((a, b) => sortAlphabetically(a.label, b.label))
          .map(category => ({
            type: category.template_type,
            label: category.label
          }))

        setCategories(loadedCategories)
        setSelectedTab(loadedCategories[0].type)
      } catch (e) {
        // use template types as a plan B when we can load accurate categories list
        setCategories(
          pickerProps.templateTypes
            .sort((a, b) =>
              sortAlphabetically(
                getTemplateTypeLabel(a),
                getTemplateTypeLabel(b)
              )
            )
            .map(type => ({
              type,
              label: getTemplateTypeLabel(type)
            }))
        )
        console.log(e)
      }
    }
    getCategories()
  }, [activeBrandId, pickerProps.mediums, pickerProps.templateTypes])

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
          {categories && categories.length > 1 && (
            <div className={classes.searchContainer}>
              <MarketingSearchInput
                types={categories}
                onSelect={({ type }) => setSelectedTab(type)}
              />
            </div>
          )}
        </Box>
      </DialogTitle>
      <DialogContent ref={dialogRef}>
        <MarketingTemplateAndTemplateInstancePicker
          tabs={categories.map(category => category.type)}
          {...pickerProps}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          containerRef={dialogRef}
        />
      </DialogContent>
    </Dialog>
  )
}
