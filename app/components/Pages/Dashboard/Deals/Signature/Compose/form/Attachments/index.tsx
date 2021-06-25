import React from 'react'

import { useField } from 'react-final-form'
import { Box, Button } from '@material-ui/core'

import { FieldError } from 'components/final-form-fields/FieldError'
import { ListAttachmentItem } from 'components/ListAttachmentItem'
import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'

import {
  REMOVE_ATTACHMENT,
  SET_DRAWER_STATUS
} from 'deals/contexts/actions-context/constants'

interface Props {
  isSubmitting: boolean
  onClickAddAttachments: () => void
}

export function Attachments({ isSubmitting, onClickAddAttachments }: Props) {
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
      type: SET_DRAWER_STATUS,
      isDrawerOpen: false
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
        <Button
          color="secondary"
          disabled={isSubmitting}
          onClick={handleAddAttachments}
        >
          Add More Attachments
        </Button>
      </Box>
    </div>
  )
}
