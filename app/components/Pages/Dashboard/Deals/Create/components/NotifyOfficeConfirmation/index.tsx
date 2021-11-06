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
  deal: IDeal
  isOpen: boolean
  tasks: UUID[]
  onClose: () => void
}

export function NotifyOfficeConfirmation({
  deal,
  tasks,
  isOpen,
  onClose
}: Props) {
  const dispatch = useDispatch()
  const [isMakeVisibleDialogOpen, setIsMakeVisibleDialogOpen] = useState(false)

  const notifyOffice = () => {
    if (deal.is_draft) {
      setIsMakeVisibleDialogOpen(true)

      return
    }

    requestNotifyOffice()
  }

  const requestNotifyOffice = () => {
    onClose()

    tasks.forEach(taskId =>
      dispatch(changeNeedsAttention(deal.id, taskId, true))
    )
  }

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="xs">
        <DialogContent>
          <Box textAlign="center">
            <SvgIcon path={mdiBellOutline} size={muiIconSizes.xlarge} />

            <Box my={2}>
              <Typography variant="subtitle1">
                Should we ask office to review once it’s signed?
              </Typography>
            </Box>
          </Box>

          <Box
            my={4}
            width="100"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button variant="outlined" onClick={onClose}>
              Don’t Submit for Review
            </Button>

            <Box ml={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={notifyOffice}
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
          onClose={() => setIsMakeVisibleDialogOpen(false)}
          onComplete={requestNotifyOffice}
        />
      )}
    </>
  )
}
