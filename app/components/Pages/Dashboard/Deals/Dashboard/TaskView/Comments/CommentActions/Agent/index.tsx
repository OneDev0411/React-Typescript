import { useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import MakeVisibleToAdmin from '@app/components/Pages/Dashboard/Deals/Create/MakeVisibleToAdmin'
import { IAppState } from '@app/reducers'
import { confirmation } from 'actions/confirmation'

interface Props {
  deal: IDeal
  task: IDealTask
  hasComment: boolean
  isSaving: boolean
  onSendComment: (attentionRequested: boolean, taskStatus?: string) => void
}

export default function Agent({
  deal,
  task,
  hasComment,
  isSaving,
  onSendComment
}: Props) {
  const dispatch = useDispatch()
  const [isMakeVisibleToAdminFormOpen, setIsMakeVisibleToAdminFormOpen] =
    useState(false)

  const checklist = useSelector<IAppState, IDealChecklist | null>(
    ({ deals }) => {
      return deals.checklists ? deals.checklists[task.checklist] : null
    }
  )

  const isSendDisabled =
    task.task_type === 'GeneralComments' && hasComment === false

  const sendComment = () => {
    const isBackupChecklist = checklist?.is_deactivated

    if (isBackupChecklist) {
      dispatch(
        confirmation({
          message: 'Sorry, can not send message',
          description: 'You can not Notify Office for Backup Offers.',
          confirmLabel: 'Okay, got it!',
          hideCancelButton: true
        })
      )

      return
    }

    if (deal.is_draft) {
      setIsMakeVisibleToAdminFormOpen(true)
    } else {
      onSendComment(true)
    }
  }

  const onDealVisible = () => {
    setIsMakeVisibleToAdminFormOpen(false)
    onSendComment(true)
  }

  const cancelNotify = () => {
    dispatch(
      confirmation({
        message: 'Cancel Notify Office?',
        description:
          'Your pending "Notify Office to Review" request will be canceled for this task',
        confirmLabel: 'Yes, cancel',
        cancelLabel: 'No',
        onConfirm: () => onSendComment(false, 'Incomplete')
      })
    )
  }

  return (
    <>
      {isMakeVisibleToAdminFormOpen && (
        <MakeVisibleToAdmin
          dealId={deal.id}
          onCancel={() => setIsMakeVisibleToAdminFormOpen(false)}
          onComplete={onDealVisible}
        />
      )}

      <Box>
        <Button
          color="secondary"
          variant="contained"
          disabled={isSaving || isSendDisabled}
          onClick={sendComment}
        >
          {isSaving ? 'Saving...' : 'Notify Office to Review'}
        </Button>

        {task.attention_requested && (
          <Button
            color="secondary"
            variant="outlined"
            style={{
              borderColor: '#f6a623',
              color: '#f6a623'
            }}
            disabled={isSaving}
            onClick={cancelNotify}
          >
            {isSaving ? 'Processing...' : 'Cancel Notify'}
          </Button>
        )}
      </Box>
    </>
  )
}
