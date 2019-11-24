import * as React from 'react'

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

import MarketingTemplateCard from 'components/MarketingTemplateCard'
import { ScrollableArea } from 'components/ScrollableArea'
import { ServerError } from 'components/ServerError'
import { ListSkeleton } from 'components/Skeletons/List'

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
  const [templates, loading, error] = useTemplatesHistory()
  const classes = useStyles()

  if (error) {
    return <ServerError error={error} />
  }

  if (loading) {
    return <ListSkeleton dense twoLines divider numItems={4} />
  }

  if (templates && templates.length > 0) {
    return (
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
          breakpointCols={3}
          className={classes.masonry}
        >
          {templates.map(template => (
            <MarketingTemplateCard
              key={template.id}
              classes={{ card: classes.card }}
              template={template}
              handleCustomize={() => props.onTemplateSelected(template)}
              handleEdit={() => props.onTemplateSelected(template)}
              handlePreview={() => {}}
            >
              template {template.name}
            </MarketingTemplateCard>
          ))}
        </MarketingTemplateMasonry>
      </ScrollableArea>
    )
  }

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
