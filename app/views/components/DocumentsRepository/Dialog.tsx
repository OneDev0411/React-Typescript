import { Dialog, DialogContent, makeStyles } from '@material-ui/core'

import { DocumentsRepository } from '.'

const useStyles = makeStyles(
  () => ({
    dialogContent: {
      padding: '0 !important'
    }
  }),
  {
    name: 'DocumentRepositoryDialog'
  }
)

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function DocumentsRepositoryDialog({ isOpen, onClose }: Props) {
  const classes = useStyles()

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen}>
      <DialogContent className={classes.dialogContent}>
        <DocumentsRepository onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
