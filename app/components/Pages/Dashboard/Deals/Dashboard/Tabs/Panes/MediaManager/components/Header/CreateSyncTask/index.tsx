import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'

import { getDealChecklists } from 'reducers/deals/checklists'
import { selectDealTasks } from 'reducers/deals/tasks'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'
import { setSelectedTask } from 'actions/deals'

import { IAppState } from 'reducers'

interface Props {
  user: IUser
  deal: IDeal
}

interface ReduxStateType {
  checklists: IDealChecklist[]
  tasks: IDealTask[]
}

export default function CreateSyncTask(props: Props) {
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false)

  const dispatch = useDispatch()
  const { checklists, tasks }: ReduxStateType = useSelector(
    ({ deals }: IAppState) => ({
      checklists: getDealChecklists(props.deal, deals.checklists),
      tasks: selectDealTasks(props.deal, deals.checklists, deals.tasks)
    })
  )

  const handleCreateSyncTask = async (): Promise<void> => {
    const mediaTask = tasks.find((task) => task.task_type === 'Media')

    // we already have a media task available, we don't create another one.
    if (mediaTask) {
      dispatch(setSelectedTask(mediaTask))
    } else {
      const checklist = checklists.find(
        (checklist) => checklist.checklist_type === props.deal.deal_type
      )!

      setIsCreatingTask(true)

      const task = await dispatch(
        createRequestTask({
          checklist,
          userId: props.user.id,
          dealId: props.deal.id,
          taskType: 'Media',
          taskTitle: 'Media: Photos are changed',
          notifyMessage: 'Back office has been notified'
        })
      )

      dispatch(setSelectedTask(task))

      setIsCreatingTask(false)
    }
  }

  return (
    <Button
      variant="outlined"
      disabled={isCreatingTask}
      onClick={handleCreateSyncTask}
    >
      {isCreatingTask ? 'Please wait...' : 'Message Office'}
    </Button>
  )
}
