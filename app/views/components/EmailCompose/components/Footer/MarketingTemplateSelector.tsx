import * as React from 'react'
import { useState } from 'react'

import {
  Box,
  Button,
  createStyles,
  ListItem,
  ListItemText,
  makeStyles,
  Theme
} from '@material-ui/core'
import { Link } from 'react-router'
import { range } from 'lodash'

import MarketingTemplateCard, {
  MarketingTemplateCardSkeleton
} from 'components/MarketingTemplateCard'
import { ScrollableArea } from 'components/ScrollableArea'
import { ServerError } from 'components/ServerError'
import MarketingTemplatePreviewModal from 'components/MarketingTemplatePreviewModal'

import useTemplatesHistory from '../../../../../components/Pages/Dashboard/Marketing/History/useTemplatesHistory'
import { FooterBottomDrawerZeroState } from './FooterBottomDrawerZeroState'
import { MarketingTemplateMasonry } from '../../../MarketingTemplateMasonry'

interface Props {
  onTemplateSelected: (template: IMarketingTemplateInstance) => void
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
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
          <>
            <Button
              variant="outlined"
              component={Link}
              target="_blank"
              to="/dashboard/marketing"
            >
              Open Marketing Center
            </Button>
          </>
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
        <ListItem
          dense
          button
          divider
          component={Link}
          target="_blank"
          to="/dashboard/marketing"
        >
          <ListItemText
            primary={<Box color="primary.main">Open My Designs</Box>}
          />
        </ListItem>
        <MarketingTemplateMasonry
          breakpointCols={COLUMN_COUNT}
          className={classes.masonry}
        >
          {items}
        </MarketingTemplateMasonry>
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
