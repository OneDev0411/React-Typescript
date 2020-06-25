import React, { useState } from 'react'
import { Box, Button, Link, makeStyles, Theme } from '@material-ui/core'
import { range } from 'lodash'

import MarketingTemplateCard, {
  MarketingTemplateCardSkeleton
} from 'components/MarketingTemplateCard'
import { ScrollableArea } from 'components/ScrollableArea'
import { ServerError } from 'components/ServerError'
import MarketingTemplatePreviewModal from 'components/MarketingTemplatePreviewModal'

import { useTemplatesHistory } from '../../../../../components/Pages/Dashboard/Marketing/hooks/use-templates-history'
import { FooterBottomDrawerZeroState } from './FooterBottomDrawerZeroState'
import { MarketingTemplateMasonry } from '../../../MarketingTemplateMasonry'

interface Props {
  onTemplateSelected: (template: IMarketingTemplateInstance) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    masonry: {
      paddingTop: theme.spacing(1)
    },
    card: {
      maxHeight: '12.5rem',
      minHeight: 'auto'
    }
  }),
  { name: 'MarketingTemplateSelector' }
)

export function MarketingTemplateSelector(props: Props) {
  const { templates, isLoading, error } = useTemplatesHistory()
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false)
  const [
    selectedTemplate,
    setSelectedTemplate
  ] = useState<IMarketingTemplateInstance | null>(null)

  const classes = useStyles()

  if (error) {
    return <ServerError error={error as any} />
  }

  if (templates && templates.length === 0 && !isLoading) {
    return (
      <FooterBottomDrawerZeroState
        description="There is no saved templates. Your previously used marketing email templates will appear here."
        actions={
          <Link color="secondary" target="_blank" href="/dashboard/marketing">
            Open Marketing Center
          </Link>
        }
      />
    )
  }

  const COLUMN_COUNT = 3
  const items = isLoading
    ? range(0, 2 * COLUMN_COUNT).map(i => (
        <MarketingTemplateCardSkeleton height="12.5rem" key={i} />
      ))
    : (templates || []).map(template => (
        <MarketingTemplateCard
          key={template.id}
          classes={{ card: classes.card }}
          template={template}
          handlePreview={() => {
            setSelectedTemplate(template)
            setPreviewModalOpen(true)
          }}
          actions={
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => props.onTemplateSelected(template)}
              >
                Add
              </Button>
            </>
          }
        />
      ))

  return (
    <>
      <ScrollableArea hasThinnerScrollbar shadowHeight={20} shadowColor="white">
        <Box px={2} py={1} className={classes.header}>
          <Link target="_blank" href="/dashboard/marketing" color="secondary">
            Open All Designs
          </Link>
        </Box>
        <Box pt={1}>
          <MarketingTemplateMasonry
            breakpointCols={COLUMN_COUNT}
            className={classes.masonry}
          >
            {items}
          </MarketingTemplateMasonry>
        </Box>
      </ScrollableArea>
      <MarketingTemplatePreviewModal
        type="history"
        isOpen={isPreviewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        actions={
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.onTemplateSelected(selectedTemplate)}
          >
            Add
          </Button>
        }
      />
    </>
  )
}
