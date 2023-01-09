import { Dialog, DialogContent, makeStyles } from '@material-ui/core'

import { RowActionsBuilder, SelectionType } from './types'

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
  selectionType?: SelectionType
  RowActionsBuilder?: RowActionsBuilder
  onClose: () => void
}

export function DocumentsRepositoryDialog({
  isOpen,
  RowActionsBuilder,
  selectionType = 'multiple',
  onClose
}: Props) {
  const classes = useStyles()

  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen}>
      <DialogContent className={classes.dialogContent}>
        <DocumentsRepository
          selectionType={selectionType}
          RowActionsBuilder={RowActionsBuilder}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
