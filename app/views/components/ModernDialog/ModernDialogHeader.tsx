import {
  IconButton,
  IconButtonProps,
  DialogTitle,
  Typography,
  makeStyles
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useCloseModernDialog } from './use-close-modern-dialog'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: theme.spacing(7),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      paddingRight: theme.spacing(1)
    },
    title: { flex: 1 }
  }),
  { name: 'ModernDialogHeader' }
)

interface ModernDialogHeaderProps {
  title: string
  closeProps?: Omit<IconButtonProps, 'onClick'>
  onCloseClick?: () => void
}

function ModernDialogHeader({
  title,
  closeProps,
  onCloseClick
}: ModernDialogHeaderProps) {
  const classes = useStyles()
  const closeDialog = useCloseModernDialog()

  const handleClose = () => {
    closeDialog()
    onCloseClick?.()
  }

  return (
    <div className={classes.root}>
      <DialogTitle className={classes.title} disableTypography>
        <Typography variant="subtitle1">{title}</Typography>
      </DialogTitle>
      <IconButton {...closeProps} onClick={handleClose}>
        <SvgIcon path={mdiClose} />
      </IconButton>
    </div>
  )
}

export default ModernDialogHeader
