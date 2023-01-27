import { Dialog, DialogContent, makeStyles } from '@material-ui/core'

import { DocumentsRepository } from '.'
import type { Props as BaseProps } from '.'

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
}

export function DocumentsRepositoryDialog({
  isOpen,
  deal,
  RowActionsBuilder,
  selectionType = 'multiple',
  onClose
}: Props & BaseProps) {
  const classes = useStyles()

  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen}>
      <DialogContent className={classes.dialogContent}>
        <DocumentsRepository
          deal={deal}
          selectionType={selectionType}
          RowActionsBuilder={RowActionsBuilder}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
