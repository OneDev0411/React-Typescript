import React from 'react'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { useTheme } from '@material-ui/styles'

import { Theme, Typography } from '@material-ui/core'

import ActionsButton from '../../../../../components/ActionsButton'
import { EnvelopeStatus } from '../../EnvelopeStatus'

import { ItemContainer, ItemRow, ItemTitle, ItemDate } from '../styled'

interface Props {
  deal: IDeal
  task: IDealTask
  envelope: IDealEnvelope
}

export function Envelope({ deal, task, envelope }: Props) {
  const theme = useTheme<Theme>()

  return (
    <ItemContainer>
      <ItemRow>
        <Flex alignCenter justifyBetween>
          <Flex column>
            <ItemTitle>{envelope.title}</ItemTitle>

            <Flex
              style={{
                margin: theme.spacing(1, 0)
              }}
            >
              <EnvelopeStatus
                type="envelope"
                deal={deal}
                task={task}
                envelope={envelope}
              />

              <ItemDate>
                Created at{' '}
                {fecha.format(
                  new Date(envelope.created_at * 1000),
                  'MMM DD YYYY, h:mm A'
                )}
              </ItemDate>
            </Flex>
          </Flex>

          <ActionsButton
            type="document"
            deal={deal}
            task={task}
            document={task}
          />
        </Flex>

        <Flex alignCenter>
          <Typography variant="body2" color="textSecondary">
            To: &nbsp;
          </Typography>

          {envelope.recipients.map((recipient, index) => (
            <Typography
              key={recipient.id}
              variant="body2"
              color="textSecondary"
            >
              {recipient.role.legal_full_name}
              {index < envelope.recipients.length - 1 && <span>,&nbsp;</span>}
            </Typography>
          ))}
        </Flex>
      </ItemRow>
    </ItemContainer>
  )
}
