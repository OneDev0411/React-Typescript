import React from 'react'
import { Button, Box } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import AddToFlowButton from 'components/AddToFlowButton'
import FlowIcon from 'components/SvgIcons/ThunderboltOutline/IconThunderboltOutline'

import { Section } from '../components/Section'
import List from './List/List'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButtonIcon: {
      marginRight: theme.spacing(1)
    }
  })
)

interface Props {
  addCallback: () => void
  contactId: UUID
  flows: TBrandFlow<'steps'>[] | null
  onStop: (flowId: UUID) => Promise<void>
}

function FlowsList({ flows, contactId, onStop, addCallback }: Props) {
  const classes = useStyles()

  return (
    <Section
      title="Flows"
      setting={{
        tooltip: 'Manage Flows',
        href: '/dashboard/account/flows'
      }}
    >
      <Box px={3}>
        {Array.isArray(flows) && <List items={flows} onStop={onStop} />}
        <AddToFlowButton
          activeFlows={[]}
          callback={addCallback}
          contacts={{ ids: [contactId] }}
          buttonRenderer={buttonProps => (
            <Button
              {...buttonProps}
              color="secondary"
              fullWidth
              variant="outlined"
            >
              <FlowIcon className={classes.addButtonIcon} />
              Add To Flow
            </Button>
          )}
        />
      </Box>
    </Section>
  )
}

export default FlowsList
