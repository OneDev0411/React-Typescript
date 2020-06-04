import React from 'react'
import {
  Box,
  Tooltip,
  Theme,
  Button,
  createStyles,
  makeStyles
} from '@material-ui/core'

import AddToFlowButton from 'components/AddToFlowButton'
import IconThunderbolt from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'

import { Section } from '../components/Section'
import List from './List/List'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      button: {
        color: theme.palette.grey['500'],
        marginLeft: 0,
        '& svg': {
          fill: theme.palette.grey['500'],
          width: '0.8em',
          height: '0.8em',
          marginRight: '0.25rem'
        }
      }
    }),
  { name: 'AddFlow' }
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
            <Tooltip title="Add to Flow">
              <Button className={classes.button} {...buttonProps}>
                <IconThunderbolt />+
              </Button>
            </Tooltip>
          )}
        />
      </Box>
    </Section>
  )
}

export default FlowsList
