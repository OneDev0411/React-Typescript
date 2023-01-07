import { Dialog, DialogContent, makeStyles } from '@material-ui/core'

import { SelectionType } from './types'

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
  onClose: () => void
}

export function DocumentsRepositoryDialog({
  isOpen,
  selectionType = 'multiple',
  onClose
}: Props) {
  const classes = useStyles()

  console.log('!!', selectionType)

  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen}>
      <DialogContent className={classes.dialogContent}>
        <DocumentsRepository selectionType={selectionType} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
