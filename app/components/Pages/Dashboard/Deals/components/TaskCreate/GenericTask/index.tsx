import { useState, useCallback } from 'react'

import { Box, TextField, Button } from '@material-ui/core'
import { useDropzone } from 'dropzone'
import { useDispatch } from 'react-redux'

import { getAcceptedDocuments } from '@app/models/Deal/helpers/upload'
import { setUploadFiles } from '@app/store_actions/deals'

interface Props {
  onCreateTask: ({
    title: string,
    taskType: IDealTaskType
  }) => Promise<IDealTask | undefined>
}

export function GenericTask({ onCreateTask }: Props) {
  const dispatch = useDispatch()
  const [taskTitle, setTaskTitle] = useState('')

  const handleCreateTask = () => {
    onCreateTask({
      taskType: 'Splitter',
      title: taskTitle.trim()
    })
  }

  const onDropFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) {
        return
      }

      const task = await onCreateTask({
        taskType: 'Splitter',
        title: taskTitle
      })

      task && dispatch(setUploadFiles(files, task.id))
    },
    [taskTitle, onCreateTask, dispatch]
  )

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: getAcceptedDocuments(),
    onDrop: onDropFiles
  })

  const handleSelectFiles = () => {
    openFileDialog()
  }

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <Box my={2}>
        <TextField
          fullWidth
          value={taskTitle}
          label="Folder Name"
          helperText="Accurate titles help with context when glancing through your
        checklist."
          onChange={e => setTaskTitle(e.target.value)}
        />

        <Box my={6} display="flex" flexDirection="row-reverse">
          <Button
            color="secondary"
            variant="outlined"
            style={{ marginLeft: '0.5rem' }}
            disabled={taskTitle.length === 0}
            onClick={handleSelectFiles}
          >
            Create Folder & Upload
          </Button>

          <Box ml={1}>
            <Button
              color="secondary"
              variant="contained"
              disabled={taskTitle.trim().length === 0}
              onClick={handleCreateTask}
            >
              Create Folder
            </Button>
          </Box>
        </Box>
      </Box>

      <input {...getInputProps()} />
    </div>
  )
}
