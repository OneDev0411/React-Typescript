import React from 'react'
import sortBy from 'lodash/sortBy'

import { DigitalForm } from './DigitalForm'
import { Attachment } from './Attachment'

import { Container } from './styled'

interface Props {
  isOpen: boolean
  deal: IDeal
  task: IDealTask
  isBackOffice: boolean
}

export function TaskItems(props: Props) {
  if (!props.isOpen) {
    return null
  }

  const getFiles = () => {
    const attachments: (IFile | IDealTask)[] = props.task.room.attachments || []

    return sortBy(attachments.concat(props.task), item => {
      const time =
        item.type === 'task' && item.submission
          ? item.submission.updated_at
          : item.updated_at

      return time * -1
    })
  }

  return (
    <Container>
      {getFiles().map((item, key) =>
        item.type === 'task' ? (
          <DigitalForm key={key} task={item} deal={props.deal} />
        ) : (
          <Attachment
            key={key}
            deal={props.deal}
            task={props.task}
            file={item}
            isBackOffice={props.isBackOffice}
          />
        )
      )}
    </Container>
  )
}
