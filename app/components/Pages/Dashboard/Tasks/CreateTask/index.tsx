import { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import { useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'
import { EventDrawer } from '@app/views/components/EventDrawer'
import { SvgIcon } from '@app/views/components/SvgIcons'

import { useCreateTaskMutation } from '../queries/use-create-task-mutation'
import type { ITask } from '../types'

export function CreateTask() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const user = useSelector(selectUserUnsafe)

  const { mutate } = useCreateTaskMutation()

  return (
    <>
      <Button
        size="large"
        color="primary"
        variant="contained"
        startIcon={<SvgIcon path={mdiPlus} />}
        onClick={() => setIsDrawerOpen(true)}
      >
        Add Task
      </Button>

      {isDrawerOpen && (
        <EventDrawer
          isOpen
          title="Create Task"
          user={user}
          dateType="limit"
          initialValues={{}}
          onClose={() => setIsDrawerOpen(false)}
          submitCallback={(task: ITask) => {
            mutate(task)
            setIsDrawerOpen(false)
          }}
        />
      )}
    </>
  )
}
