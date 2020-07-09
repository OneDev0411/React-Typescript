import React from 'react'

import { useField } from 'react-final-form'
import { Box, Button } from '@material-ui/core'

import { FieldError } from 'components/final-form-fields/FieldError'
import { ListAttachmentItem } from 'components/ListAttachmentItem'
import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'

import {
  DOCUSIGN_FORM,
  DOCUSIGN_FILE,
  DOCUSIGN_ENVELOPE
} from 'deals/components/ActionsButton/data/action-buttons'

import {
  ADD_ATTACHMENTS,
  REMOVE_ATTACHMENT
} from 'deals/contexts/actions-context/constants'

interface Props {
  onClickAddAttachments: () => void
}

export function Attachments({ onClickAddAttachments }: Props) {
  const field = useField('attachments')
  const [, actionsDispatch] = useChecklistActionsContext()

  const list = field.input.value || []

  const handleDelete = (attachment: IDealFile) => {
    const attachments = list.filter(
      (item: typeof attachment) => item.id !== attachment.id
    )

    actionsDispatch({
      type: REMOVE_ATTACHMENT,
      attachment
    })

    field.input.onChange(attachments)
  }

  const handleAddAttachments = () => {
    actionsDispatch({
      type: ADD_ATTACHMENTS,
      actions: [DOCUSIGN_FORM, DOCUSIGN_FILE, DOCUSIGN_ENVELOPE],
      attachments: []
    })

    onClickAddAttachments()
  }

  return (
    <div>
      <Box marginTop={2}>
        {list.map((attachment: IDealFile, index: number) => (
          <ListAttachmentItem
            key={index}
            isRemovable={list.length > 1}
            attachment={attachment}
            onDelete={handleDelete}
          />
        ))}

        <FieldError name={field.name} />
      </Box>

      <Box marginBottom={2}>
        <Button color="secondary" onClick={handleAddAttachments}>
          Add More Attachments
        </Button>
      </Box>
    </div>
  )
}
