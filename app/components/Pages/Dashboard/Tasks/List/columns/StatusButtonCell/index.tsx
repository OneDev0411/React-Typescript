import { memo, useState } from 'react'

import { useTheme, Theme, makeStyles } from '@material-ui/core'
import { mdiCheck } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    statusButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.spacing(2.8),
      height: theme.spacing(2.8),
      borderRadius: '100%',
      border: '1px solid #000',
      backgroundColor: '#fff',
      '&.done': {
        backgroundColor: theme.palette.success.ultralight,
        border: `1px solid ${theme.palette.success.main}`
      },
      '& svg': {
        transform: 'scale(1.5)'
      }
    }
  }),
  {
    name: 'Tasks-TitleCell'
  }
)

interface Props {
  defaultStatus: ICRMTaskStatus
}

function StatusButtonCellComponent({ defaultStatus }: Props) {
  const [status, setStatus] = useState(defaultStatus)
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const handleChangeStatus = () => {
    const nextStatus: ICRMTaskStatus = status === 'DONE' ? 'PENDING' : 'DONE'

    setStatus(nextStatus)
  }

  return (
    <button
      type="button"
      onClick={handleChangeStatus}
      className={cn(classes.statusButton, {
        done: status === 'DONE'
      })}
    >
      <SvgIcon
        path={mdiCheck}
        size={muiIconSizes.large}
        color={status === 'DONE' ? theme.palette.success.main : '#000'}
      />
    </button>
  )
}

export const StatusButtonCell = memo(StatusButtonCellComponent)
