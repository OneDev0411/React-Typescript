import { MouseEvent } from 'react'

import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { SvgIcon } from '../../SvgIcons/SvgIcon'

interface Props {
  onClick: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginBottom: theme.spacing(4),
      padding: theme.spacing(0, 1, 0, 2)
    },
    label: {
      marginTop: theme.spacing(0.25)
    },
    root: {
      borderRadius: theme.spacing(8),
      fontSize: theme.typography.body2.fontSize
    }
  })
)

export default function GlobalActionsMenu({ onClick }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        startIcon={<SvgIcon path={mdiPlus} />}
        classes={{
          root: classes.root
        }}
      >
        <span className={classes.label}>CREATE</span>
      </Button>
    </div>
  )
}
