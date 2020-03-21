import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { Button } from '@material-ui/core'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'
import { deleteDeal } from 'actions/deals'
import { confirmation } from 'actions/confirmation'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'

import { getActiveChecklist } from 'models/Deal/helpers/get-active-checklist'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export default function DeleteDeal(props: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useDispatch()

  const { user, checklists } = useSelector(({ deals, user }: IAppState) => ({
    user,
    checklists: getDealChecklists(props.deal, deals.checklists)
  }))

  const handleClick = () => {
    if (props.isBackOffice === false && props.deal.is_draft === false) {
      dispatch(
        confirmation({
          message: 'Delete Deal',
          description: 'Only your back office can delete this deal.',
          needsUserEntry: true,
          inputDefaultValue: 'Please remove this deal.',
          confirmLabel: 'Yes, Delete',
          onConfirm: handleSendRequest
        })
      )

      return
    }

    dispatch(
      confirmation({
        message: 'Delete Deal',
        description: 'Are you sure you want to delete this deal?',
        confirmLabel: 'Yes, Delete',
        onConfirm: handleDelete
      })
    )
  }

  const handleSendRequest = text => {
    const checklist = getActiveChecklist(props.deal, checklists)

    dispatch(
      createRequestTask({
        checklist,
        userId: user.id,
        dealId: props.deal.id,
        taskType: 'Generic',
        taskTitle: 'Remove deal',
        taskComment: text,
        notifyMessage: 'Back office has been notified to remove the deal'
      })
    )
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await dispatch(deleteDeal(props.deal.id))

      dispatch(
        notify({
          message: 'The deal is deleted.',
          status: 'success'
        })
      )
    } catch (e) {
      return false
    }

    setIsDeleting(false)
  }

  if (props.deal.deleted_at !== null) {
    return false
  }

  return (
    <Button
      fullWidth
      disabled={isDeleting}
      variant="outlined"
      color="secondary"
      onClick={handleClick}
    >
      Delete Deal
    </Button>
  )
}
