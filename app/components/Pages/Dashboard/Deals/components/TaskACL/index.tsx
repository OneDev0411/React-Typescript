import { useState } from 'react'

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Typography
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import { updateTask } from '@app/store_actions/deals'
import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'

interface Props {
  task: IDealTask
  onClose: () => void
}

export function TaskACL({ task, onClose }: Props) {
  const dispatch = useDispatch()
  const notify = useNotify()

  const [isPublicTask, setIsPublicTask] = useState(task.acl.includes('Agents'))

  const handleUpdate = () => {
    try {
      dispatch(
        updateTask(task.id, {
          acl: isPublicTask ? ['BackOffice', 'Agents'] : ['BackOffice']
        })
      )
    } catch (e) {
      notify({
        status: 'error',
        message: 'Could not update task access'
      })
    }

    onClose()
  }

  return (
    <Dialog open fullWidth maxWidth="xs">
      <DialogContent>
        <Box mb={2}>
          <Typography variant="h6">
            <TextMiddleTruncate text={task.title} maxLength={40} />
            's access
          </Typography>
        </Box>

        <Typography variant="body2">
          Who do you want to be able to see and work on this document?
        </Typography>

        <Box display="flex" mt={1}>
          <Box mr={3}>
            <FormControlLabel
              control={<Checkbox checked disabled name="admin" />}
              label="Admins"
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={isPublicTask}
                onChange={() => setIsPublicTask(access => !access)}
                name="agent"
              />
            }
            label="Agents"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={task.acl.includes('Agents') === isPublicTask}
          onClick={handleUpdate}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
