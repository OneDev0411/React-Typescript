import { useState } from 'react'

import { useSelector } from 'react-redux'

import { useReduxDispatch } from '@app/hooks/use-redux-dispatch'
import { IAppState } from '@app/reducers'
import { selectChecklistTasks } from '@app/reducers/deals/tasks'
import { createTask } from 'actions/deals'
import LoadingContainer from 'components/LoadingContainer'
import OverlayDrawer from 'components/OverlayDrawer'

import { FormTask } from './FormTask'
import { GenericTask } from './GenericTask'
import { SplitterTask } from './SplitterTask'

interface Props {
  deal: IDeal
  checklist: Nullable<IDealChecklist>
  taskType: Nullable<IDealTaskType>
  onClose: () => void
}

export default function TaskCreate({
  deal,
  checklist,
  taskType,
  onClose
}: Props) {
  const dispatch = useReduxDispatch()

  const [isCreating, setIsCreating] = useState(false)
  const tasks = useSelector<IAppState, IDealTask[]>(({ deals }) =>
    selectChecklistTasks(checklist, deals.tasks)
  )

  const handleCreateTask = async ({
    title,
    form
  }: {
    form?: UUID
    title: string
    taskType: IDealTaskType
  }): Promise<IDealTask | undefined> => {
    try {
      setIsCreating(true)

      const maxOrder = tasks.reduce(
        (max, task) => (task.order > max ? task.order : max),
        0
      )

      const task: Promise<IDealTask> = await dispatch(
        createTask({
          dealId: deal.id,
          taskTitle: title,
          checklistId: checklist!.id,
          taskType,
          form,
          order: maxOrder + 1
        })
      )

      setIsCreating(false)

      return task
    } catch (e) {
      console.log(e)
    } finally {
      onClose()
    }
  }

  return (
    <OverlayDrawer open={!!taskType} onClose={onClose}>
      {isCreating ? (
        <LoadingContainer style={{ height: '90vh' }} />
      ) : (
        <>
          {taskType === 'Form' && (
            <>
              <OverlayDrawer.Header title="Add new Form" />
              <OverlayDrawer.Body>
                <FormTask deal={deal} onSelectForm={handleCreateTask} />
              </OverlayDrawer.Body>
            </>
          )}

          {taskType === 'Generic' && (
            <>
              <OverlayDrawer.Header title="Add new Folder" />
              <OverlayDrawer.Body>
                <GenericTask onCreateTask={handleCreateTask} />
              </OverlayDrawer.Body>
            </>
          )}

          {taskType === 'Splitter' && (
            <>
              <OverlayDrawer.Header title="Add new Section" />
              <OverlayDrawer.Body>
                <SplitterTask onCreateTask={handleCreateTask} />
              </OverlayDrawer.Body>
            </>
          )}
        </>
      )}
    </OverlayDrawer>
  )
}
