import { makeStyles, StepIconProps, Theme } from '@material-ui/core'
import { mdiCheck, mdiFile, mdiFormatListText, mdiUpload } from '@mdi/js'
import cn from 'classnames'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      color: theme.palette.grey[500],
      '&.active': {
        color: theme.palette.primary.main
      },
      '&.completed': {
        color: theme.palette.primary.main
      }
    }
  }),
  {
    name: 'UploadSteps-StepIcon'
  }
)

const IconsList = {
  1: mdiFile,
  2: mdiFormatListText,
  3: mdiUpload
}

export function StepIcon({ active, completed, icon }: StepIconProps) {
  const classes = useStyles()

  return (
    <SvgIcon
      path={completed ? mdiCheck : IconsList[String(icon)]}
      className={cn(classes.root, {
        active,
        completed
      })}
    />
  )
}
