import { useState } from 'react'

import {
  Dialog,
  Typography,
  DialogContent,
  Box,
  Button
} from '@material-ui/core'
import { mdiBellOutline } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { changeNeedsAttention } from '@app/store_actions/deals'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import MakeVisibleToAdmin from '../../MakeVisibleToAdmin'

interface Props {
  title: string
  deal: IDeal
  isOpen: boolean
  tasks?: UUID[]
  onClose: (notifyOffice: boolean) => void
}

export function NotifyOfficeConfirmation({
  title,
  deal,
  tasks,
  isOpen,
  onClose
}: Props) {
  const dispatch = useDispatch()
  const [isMakeVisibleDialogOpen, setIsMakeVisibleDialogOpen] = useState(false)

  const handleClose = () => {
    onClose(false)
    setIsMakeVisibleDialogOpen(false)
  }

  const handleNotifyOffice = () => {
    if (deal.is_draft) {
      setIsMakeVisibleDialogOpen(true)

      return
    }

    notifyOffice()
  }

  const notifyOffice = () => {
    if (tasks) {
      tasks.forEach(taskId =>
        dispatch(changeNeedsAttention(deal.id, taskId, true))
      )
    }

    setIsMakeVisibleDialogOpen(false)
    onClose(true)
  }

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="xs">
        <DialogContent>
          <Box textAlign="center">
            <SvgIcon path={mdiBellOutline} size={muiIconSizes.xlarge} />

            <Box my={2}>
              <Typography variant="subtitle1">{title}</Typography>
            </Box>
          </Box>

          <Box
            my={4}
            width="100"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button variant="outlined" onClick={handleClose}>
              Don’t Submit for Review
            </Button>

            <Box ml={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNotifyOffice}
              >
                Submit for Review
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {isMakeVisibleDialogOpen && (
        <MakeVisibleToAdmin
          dealId={deal.id}
          onClose={handleClose}
          onComplete={notifyOffice}
        />
      )}
    </>
  )
}
