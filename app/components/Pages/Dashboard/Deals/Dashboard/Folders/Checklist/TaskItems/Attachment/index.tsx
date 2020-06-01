import React from 'react'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import ActionsButton from '../../../../../components/ActionsButton'

import { ItemLink } from './ItemLink'

import { ItemContainer, ItemRow, ItemTitle, ItemDate } from '../styled'
import { LabelItem } from '../../../styled'

import getFileActions from './get-file-actions'

interface Props {
  deal: IDeal
  task: IDealTask
  file: IFile
  isBackOffice: boolean
}

export function Attachment({ deal, task, file, isBackOffice }: Props) {
  const actions: ActionButtonId[] = getFileActions(file)

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

            <Flex>
              <LabelItem>Uploaded File</LabelItem>

              <ItemDate>
                Uploaded at{' '}
                {fecha.format(
                  new Date(file.created_at * 1000),
                  'MMM DD YYYY, h:mm A'
                )}
              </ItemDate>
            </Flex>
          </Flex>

          <ActionsButton
            deal={deal}
            task={task}
            file={file}
            actions={actions}
          />
        </Flex>
      </ItemRow>
    </ItemContainer>
  )
}
