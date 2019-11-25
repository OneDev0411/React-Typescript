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
import { range } from 'lodash'

import MarketingTemplateCard, {
  MarketingTemplateCardSkeleton
} from 'components/MarketingTemplateCard'
import { ScrollableArea } from 'components/ScrollableArea'
import { ServerError } from 'components/ServerError'

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

  if (templates && templates.length === 0 && !loading) {
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
  const items = loading
    ? range(0, 2 * COLUMN_COUNT).map(i => (
        <MarketingTemplateCardSkeleton height="12.5rem" key={i} />
      ))
    : (templates || []).map(template => (
        <MarketingTemplateCard
          key={template.id}
          classes={{ card: classes.card }}
          template={template}
        />
      ))

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
        breakpointCols={COLUMN_COUNT}
        className={classes.masonry}
      >
        {items}
      </MarketingTemplateMasonry>
    </ScrollableArea>
  )
}
