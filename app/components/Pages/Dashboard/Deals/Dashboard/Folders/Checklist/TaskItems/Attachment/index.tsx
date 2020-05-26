import React from 'react'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { EnvelopeStatus } from '../../EnvelopeStatus'
import ActionsButton from '../../../../../components/ActionsButton'

import { ItemLink } from './ItemLink'

import { ItemContainer, ItemRow, ItemTitle, ItemDate } from '../styled'

interface Props {
  deal: IDeal
  task: IDealTask
  file: IFile
  isBackOffice: boolean
}

export function Attachment({ deal, task, file, isBackOffice }: Props) {
  return (
    <ItemContainer>
      <ItemRow>
        <Flex alignCenter justifyBetween>
          <Flex column>
            <ItemTitle>
              <ItemLink
                file={file}
                deal={deal}
                taskId={task.id}
                isBackOffice={isBackOffice}
              >
                <TextMiddleTruncate text={file.name} maxLength={75} />
              </ItemLink>
            </ItemTitle>

            <ItemDate>
              Uploaded at{' '}
              {fecha.format(
                new Date(file.created_at * 1000),
                'MMM DD YYYY, h:mm A'
              )}
            </ItemDate>
          </Flex>

          <ActionsButton
            type="document"
            deal={deal}
            task={task}
            document={file}
          />
        </Flex>

        <Flex alignCenter>
          <EnvelopeStatus
            type="document"
            deal={deal}
            task={task}
            document={file}
          />
        </Flex>
      </ItemRow>
    </ItemContainer>
  )
}
