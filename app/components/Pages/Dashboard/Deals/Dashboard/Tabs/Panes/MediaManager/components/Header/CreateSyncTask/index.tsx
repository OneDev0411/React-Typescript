import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import { getDealChecklists } from 'reducers/deals/checklists'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'

import { IAppState } from 'reducers'

interface Props {
  user: IUser
  deal: IDeal
}

interface ReduxStateType {
  checklists: IDealChecklist[]
}

export default function CreateSyncTask(props: Props) {
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false)

  const { checklists }: ReduxStateType = useSelector(
    ({ deals }: IAppState) => ({
      checklists: getDealChecklists(props.deal, deals.checklists)
    })
  )
  const dispatch = useDispatch()

  const handleCreateSyncTask = async (): Promise<void> => {
    const checklist = checklists.find(
      checklist => checklist.checklist_type === 'Selling'
    ) as IDealChecklist

    setIsCreatingTask(true)

    const task = await dispatch(
      createRequestTask({
        checklist,
        userId: props.user.id,
        dealId: props.deal.id,
        taskType: 'Media',
        taskTitle: 'Media: Please sync photos',
        taskComment: 'Please be sure all photos are synced with MLS',
        notifyMessage: 'Back office has been notified'
      })
    )

    setIsCreatingTask(false)
  }

  return (
    <Button
      variant="outlined"
      disabled={isCreatingTask}
      onClick={handleCreateSyncTask}
    >
      {isCreatingTask ? 'Creating...' : 'Request MLS Sync'}
    </Button>
  )
}
