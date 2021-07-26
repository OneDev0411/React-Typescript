import React, { useState } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { connect } from 'react-redux'

import { setTaskRequirement } from 'actions/deals/task/set-task-requirement'

interface DispatchProps {
  setTaskRequirement(taskId: UUID, required: boolean): void
}

interface Props {
  task: IDealTask
}

function RequiredAction({ task, setTaskRequirement }: Props & DispatchProps) {
  const [isTaskRequired, setIsTaskRequired] = useState<boolean>(task.required)

  const handleChange = async () => {
    try {
      setIsTaskRequired(!task.required)
      await setTaskRequirement(task.id, !task.required)
    } catch (e) {
      console.log(e)
      setIsTaskRequired(task.required)
    }
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={isTaskRequired} onChange={handleChange} />}
      label="Required Task"
    />
  )
}

export default connect<null, DispatchProps, Props>(null, {
  setTaskRequirement
})(RequiredAction)
