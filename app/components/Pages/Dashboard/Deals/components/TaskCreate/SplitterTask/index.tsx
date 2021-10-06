import { useState } from 'react'

import { Box, TextField, Button } from '@material-ui/core'

interface Props {
  onCreateTask: ({ title: string, taskType: IDealTaskType }) => void
}

export function SplitterTask({ onCreateTask }: Props) {
  const [taskTitle, setTaskTitle] = useState('')

  const handleCreateTask = () => {
    onCreateTask({
      taskType: 'Splitter',
      title: taskTitle.trim()
    })
  }

  return (
    <Box my={2}>
      <TextField
        fullWidth
        value={taskTitle}
        label="Section Name"
        onChange={e => setTaskTitle(e.target.value)}
      />

      <Box my={6} display="flex" flexDirection="row-reverse">
        <Button
          color="secondary"
          variant="contained"
          disabled={taskTitle.trim().length === 0}
          onClick={handleCreateTask}
        >
          Create Section
        </Button>
      </Box>
    </Box>
  )
}
