import { useState } from 'react'

import { useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import { useReduxDispatch } from '@app/hooks/use-redux-dispatch'
import { IAppState } from '@app/reducers'
import { selectChecklistTasks } from '@app/reducers/deals/tasks'
import { PreviewActionButton } from '@app/views/components/DocumentsRepository/components/row-actions/PreviewActionButton'
import { SelectActionButton } from '@app/views/components/DocumentsRepository/components/row-actions/SelectActionButton'
import { DocumentsRepositoryDialog } from '@app/views/components/DocumentsRepository/Dialog'
import { createTask } from 'actions/deals'
import LoadingContainer from 'components/LoadingContainer'
import OverlayDrawer from 'components/OverlayDrawer'

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

  const notify = useNotify()
  const [isCreating, setIsCreating] = useState(false)
  const tasks = useSelector<IAppState, IDealTask[]>(({ deals }) =>
    selectChecklistTasks(checklist, deals.tasks)
  )

  const onSelectFormTask = (form: IBrandForm) => {
    handleCreateTask({
      title: form.name,
      form: form.id,
      taskType: 'Form'
    })

    notify({
      status: 'success',
      message: 'The form has been successfully created.'
    })
  }

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
      notify({
        status: 'error',
        message: 'An error occurred during task creation. Please try again.'
      })
    } finally {
      onClose()
    }
  }

  return (
    <>
      <OverlayDrawer
        open={!!taskType && ['Generic', 'Splitter'].includes(taskType)}
        onClose={onClose}
      >
        {isCreating ? (
          <LoadingContainer style={{ height: '90vh' }} />
        ) : (
          <>
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

      {taskType === 'Form' && !isCreating && (
        <DocumentsRepositoryDialog
          isOpen
          selectionType="single"
          RowActionsBuilder={({ form }) => (
            <>
              <PreviewActionButton form={form} />
              <SelectActionButton form={form} onSelect={onSelectFormTask} />
            </>
          )}
          onClose={onClose}
        />
      )}
    </>
  )
}
