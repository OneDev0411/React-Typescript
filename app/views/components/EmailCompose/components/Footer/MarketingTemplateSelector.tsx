import * as React from 'react'

import { Box, Button, ListItem, ListItemText } from '@material-ui/core'

import { Link } from 'react-router'

import useTemplatesHistory from '../../../../../components/Pages/Dashboard/Marketing/History/useTemplatesHistory'
import { ScrollableArea } from '../../../ScrollableArea'
import { ServerError } from '../../../ServerError'
import { FooterBottomDrawerZeroState } from './FooterBottomDrawerZeroState'
import { ListSkeleton } from '../../../Skeletons/List'

interface Props {
  onTemplateSelected: (template: IMarketingTemplateInstance) => void
}

export function MarketingTemplateSelector(props: Props) {
  const [templates, loading, error] = useTemplatesHistory()

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
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => props.onTemplateSelected(template)}
          >
            template {template.name}
          </div>
        ))}
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
